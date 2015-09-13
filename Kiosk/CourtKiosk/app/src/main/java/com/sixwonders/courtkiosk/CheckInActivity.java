package com.sixwonders.courtkiosk;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ComponentName;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Parcelable;
import android.preference.PreferenceManager;
import android.support.v7.app.ActionBarActivity;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.Toast;

import com.microblink.activity.Pdf417ScanActivity;
import com.microblink.recognizers.barcode.pdf417.Pdf417RecognizerSettings;
import com.microblink.recognizers.settings.RecognizerSettings;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;

import java.util.ArrayList;


public class CheckInActivity extends ActionBarActivity implements AsyncResponse {
    private View view;
    private Button btnIdScan;
    private Button btnInfoSubmit;
    private Activity activity;
    private DatePicker datePicker;

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == 888) {
            if (resultCode == Pdf417ScanActivity.RESULT_OK && data != null) {
                // perform processing of the data here

                // for example, obtain parcelable recognition result
                Bundle extras = data.getExtras();
                Parcelable[] resultArray = data.getParcelableArrayExtra(Pdf417ScanActivity.EXTRAS_RECOGNITION_RESULT_LIST);
                // Each element in resultArray inherits BaseRecognitionResult class and
                // represents the scan result of one of activated recognizers that have
                // been set up. More information about this can be found in
                // "Recognition settings and results" chapter
                ConnectionUtil connectionUtil = new ConnectionUtil();
                connectionUtil.authCall("Todd", "Lewis", "05/21/1953", (AsyncResponse)activity);
            }
        }
    }

    private RecognizerSettings[] setupSettingsArray() {
        Pdf417RecognizerSettings sett = new Pdf417RecognizerSettings();
        // disable scanning of white barcodes on black background
        sett.setInverseScanning(false);
        // allow scanning of barcodes that have invalid checksum
        sett.setUncertainScanning(true);
        // disable scanning of barcodes that do not have quiet zone
        // as defined by the standard
        sett.setNullQuietZoneAllowed(false);

        // now add sett to recognizer settings array that is used to configure
        // recognition
        return new RecognizerSettings[] { sett };
    }
    private void callToScan(){
        Intent intent = new Intent(this, Pdf417ScanActivity.class);
        intent.putExtra(Pdf417ScanActivity.EXTRAS_LICENSE_KEY, "6HOO5ENX-W626VWJ2-KPN7ZB2A-76COKQH7-QTSUB74E-4VAP7BHF-ID7YJZKA-76CLJ45M");

        RecognizerSettings[] settArray = setupSettingsArray();
        intent.putExtra(Pdf417ScanActivity.EXTRAS_RECOGNIZER_SETTINGS_ARRAY, settArray);

// Starting Activity
        startActivityForResult(intent, 888);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        activity=this;
        view =LayoutInflater.from(this).inflate(R.layout.activity_check_in, null);
        btnInfoSubmit = (Button) view.findViewById(R.id.btnInfoSubmit);

        btnIdScan = (Button) view.findViewById(R.id.btnLicenseScan);

        btnIdScan.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                callToScan();
            }
        });

        btnInfoSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                AlertDialog.Builder builder = new AlertDialog.Builder(view.getContext());
        builder.setNegativeButton(R.string.cancel, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int id) {
            }
        });
               final View custom=LayoutInflater.from(activity).inflate(R.layout.check_in_personal_info_alertdialog, null);
        builder.setTitle(R.string.userInformationInput).setPositiveButton(R.string.continueText, new DialogInterface.OnClickListener() {

            @Override
            public void onClick(DialogInterface dialog, int id) {

                //TODO call webservice to check for user
                EditText firstName = (EditText) custom.findViewById(R.id.etFirstName);
                EditText lastName = (EditText) custom.findViewById(R.id.etLastName);
                DatePicker dob = (DatePicker) custom.findViewById(R.id.dpDob);

                if(dob==null){
                    int i=0;
                    i++;
                    i++;
                }
                int monthInt = dob.getMonth()+1;
                String month ="";
                if(monthInt<10){
                    month+="0";
                }
                month+=monthInt;

                int dayInt = dob.getDayOfMonth();
                String day ="";
                if(dayInt<10){
                    day+="0";
                }
                day+=dayInt;

                int yearInt = dob.getYear();
                String year ="";
                if(yearInt<10){
                    year+="0";
                }
                year+=yearInt;
                String dobStr = month+"/"+day+"/"+ year;

                ConnectionUtil connectionUtil = new ConnectionUtil();
                connectionUtil.authCall(firstName.getText().toString(), lastName.getText().toString(), dobStr, (AsyncResponse)activity);
            }
        });

        builder.setView(custom);

        datePicker = (DatePicker)custom.findViewById(R.id.dpDob);
        setUpDatePicker();
        AlertDialog alert = builder.create();
        alert.show();
    }
});

        setContentView(view);
    }

    private void openCompleteRegistrationActivity(Citation citation) {
        Intent intent =new Intent(this, CompletedRegistrationActivity.class);
        intent.putExtra("citation", citation);
        startActivity(intent);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_check_in, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }



    private void setUpDatePicker() {
       datePicker.setSpinnersShown(true);
       datePicker.setCalendarViewShown(false);
    }

    @Override
    public void processFinish(String callType, Object objectResult) {
        if(StringUtils.equalsIgnoreCase("auth", callType)){
            ArrayList<Citation> citations = CitationAdapter.adaptCitationData((ArrayList<JSONObject>) objectResult);
            if(citations.isEmpty()){
                //TODO: tell user info could not be found!
                Toast.makeText(this, "No court date found!", Toast.LENGTH_LONG).show();
            }
            else{
                openCompleteRegistrationActivity(citations.get(0));
            }
        }
    }
}
