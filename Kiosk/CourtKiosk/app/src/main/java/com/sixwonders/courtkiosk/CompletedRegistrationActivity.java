package com.sixwonders.courtkiosk;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;

import java.util.ArrayList;


public class CompletedRegistrationActivity extends ActionBarActivity  implements AsyncResponse{
    private View view;
    private Button btnSubmit;
    private ImageButton btnContinuationInfo;
    private Button btnContinuationYes;
    private Button btnContinuationNo;
    private Button btnNotificationYes;
    private Button btnNotificationNo;
    private Button btnRestart;
    private Activity activity;
    private Button backButton;
    private ConnectionUtil cu;
    private Citation citation;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try{
            citation = (Citation)this.getIntent().getExtras().getSerializable("citation");
        }
        catch(Exception e){
            int foo=0;
            foo++;
        }
        cu = new ConnectionUtil();
        view = LayoutInflater.from(this).inflate(R.layout.activity_completed_registration, null);
        btnContinuationInfo = (ImageButton) view.findViewById(R.id.ibContinuationInfo);
        backButton = (Button)  view.findViewById(R.id.btnBackToContinuation);
        activity=this;

        btnRestart = (Button)  view.findViewById(R.id.btnRestart);
        btnRestart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                restartLoginFlow();
            }
        });

        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                hideNotification();
                showContinuation();
                hideBackButton();
            }
        });

        btnContinuationYes = (Button) view.findViewById(R.id.btnContinuationYes);

        btnNotificationYes = (Button) view.findViewById(R.id.btnNotificationYes);
        btnNotificationYes.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                AlertDialog.Builder builder = new AlertDialog.Builder(view.getContext());
                builder.setNegativeButton(R.string.cancel, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int id) {
                    }
                });
                final View custom=LayoutInflater.from(activity).inflate(R.layout.notification_alertdialog, null);
                builder.setView(custom);
                builder.setTitle(R.string.notificationSignUp).setPositiveButton(R.string.continueText, new DialogInterface.OnClickListener() {

                    @Override
                    public void onClick(DialogInterface dialog, int id) {
                                EditText phoneNumber = (EditText) custom.findViewById(R.id.etPhoneNumber);
                                EditText email = (EditText) custom.findViewById(R.id.etEmail);
                                String emailStr = null;
                                String phoneNumberStr=null;
                                if(phoneNumber.getText()!=null){
                                    phoneNumberStr= phoneNumber.getText().toString();
                                }
                                if(email.getText()!=null){
                                    emailStr= email.getText().toString();
                                }

                        //TODO send to webservice

                        acceptNotifications(emailStr, phoneNumberStr);
                    }
                });


                AlertDialog alert = builder.create();
                alert.show();
            }
        });




        btnNotificationNo = (Button) view.findViewById(R.id.btnNotificationNo);

        btnNotificationNo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                declineNotification();
            }
        });

        btnContinuationYes.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                DialogInterface.OnClickListener dialogClickListener = new DialogInterface.OnClickListener()
                {
                    @Override
                    public void onClick(DialogInterface dialog, int which)
                    {
                        switch(which){
                            case DialogInterface.BUTTON_POSITIVE:
                                acceptContinuation(false);
                                break;
                            case DialogInterface.BUTTON_NEGATIVE:
                                break;
                        }
                    }
                };

                AlertDialog.Builder builder = new AlertDialog.Builder(view.getContext());
                builder.setTitle(view.getResources().getString(R.string.continuationInfoAlertHeader));
                builder.setMessage(view.getResources().getString(R.string.continuationInfo));
                //No listener is needed, because this is just for their information and no actions needs to occur after it
                builder.setPositiveButton(view.getResources().getString(R.string.yes), dialogClickListener);
                builder.setNegativeButton(view.getResources().getString(R.string.no), dialogClickListener);
                builder.show();
            }
        });

        btnContinuationInfo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                AlertDialog.Builder builder = new AlertDialog.Builder(view.getContext());
                builder.setTitle(view.getResources().getString(R.string.continuationInfoAlertHeader));
                builder.setMessage(view.getResources().getString(R.string.continuationInfo));
                //No listener is needed, because this is just for their information and no actions needs to occur after it
                builder.setPositiveButton(view.getResources().getString(R.string.btnOk), null);
                builder.show();
            }
        });

        btnContinuationNo = (Button) view.findViewById(R.id.btnContinuationNo);
        btnContinuationNo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                declineContinuation();
            }
        });

        setContentView(view);
    }

    private void acceptContinuation(boolean success){
        cu.continuationCall(citation.getCitation_number()+"",this);
    }

    private void restartLoginFlow(){
        Intent intent =new Intent(this, CheckInActivity.class);
        startActivity(intent);
    }
    private void declineContinuation(){
        showNotification();
        hideContinuation();
        showBackButton();
    }

    private void declineNotification(){
        cu.completeCheckInCall(citation.getCitation_number()+"", citation.getCourt_location(),null,null,this);
    }

    private void showBackButton(){
        backButton.setVisibility(View.VISIBLE);
    }

    private void hideBackButton(){
        backButton.setVisibility(View.GONE);
    }

    private void acceptNotifications(String emailStr, String phoneNumberStr){
        cu.completeCheckInCall(citation.getCitation_number() + "", citation.getCourt_location(), emailStr, phoneNumberStr, this);
    }

    private void showSuccess(){
        RelativeLayout layout = (RelativeLayout) view.findViewById(R.id.llSuccessSignIn);
        layout.setVisibility(View.VISIBLE);
    }

    private void showNotification(){
        RelativeLayout layout = (RelativeLayout) view.findViewById(R.id.llNotificationLayout);
        layout.setVisibility(View.VISIBLE);
    }
    private void hideNotification(){
        RelativeLayout layout = (RelativeLayout) view.findViewById(R.id.llNotificationLayout);
        layout.setVisibility(View.GONE);
    }

    private void hideContinuation(){
            RelativeLayout layout = (RelativeLayout) view.findViewById(R.id.llContinuationLayout);
            layout.setVisibility(View.GONE);
    }
    private void showContinuation(){
        RelativeLayout layout = (RelativeLayout) view.findViewById(R.id.llContinuationLayout);
        layout.setVisibility(View.VISIBLE);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_completed_registration, menu);
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

    @Override
    public void processFinish(String callType, Object objectResult) {
        try{

            if(StringUtils.equalsIgnoreCase("cont", callType)){

                ArrayList<JSONObject> responses =(ArrayList<JSONObject>) objectResult;
                JSONObject response = responses.get(0);
                boolean success=false;

                if(response.has("success") && !StringUtils.isEmpty(response.getString("success"))){
                    success=true;
                }

                DialogInterface.OnClickListener dialogClickListener = new DialogInterface.OnClickListener()
                {
                    @Override
                    public void onClick(DialogInterface dialog, int which)
                    {
                        restartLoginFlow();
                    }
                };
                if(success){
                    showNotification();
                    hideContinuation();
                    hideBackButton();

                    AlertDialog.Builder builder = new AlertDialog.Builder(view.getContext());
                    builder.setTitle(view.getResources().getString(R.string.continuationCompleteHeader));
                    builder.setMessage(view.getResources().getString(R.string.continuationComplete));
                    //No listener is needed, because this is just for their information and no actions needs to occur after it
                    builder.setPositiveButton(view.getResources().getString(R.string.btnOk), dialogClickListener);
                    builder.show();

                }
                else{
                    AlertDialog.Builder builder = new AlertDialog.Builder(view.getContext());
                    builder.setTitle(view.getResources().getString(R.string.continuationFailedHeader));
                    builder.setMessage(view.getResources().getString(R.string.continuationFailed));
                    //No listener is needed, because this is just for their information and no actions needs to occur after it
                    builder.setPositiveButton(view.getResources().getString(R.string.btnOk), dialogClickListener);
                    builder.show();
                }



            }
            else if(StringUtils.equalsIgnoreCase("complete", callType)){
                ArrayList<JSONObject> responses =(ArrayList<JSONObject>) objectResult;
                JSONObject response = responses.get(0);
                boolean success=false;

                if(response.has("success") && !StringUtils.isEmpty(response.getString("success"))){
                    success=true;
                    showSuccess();
                    hideNotification();
                }
                else{
                    int i=0;
                    i++;
                }

            }
        }catch(Exception e){
            int i=0;
            i++;
        }

    }
}
