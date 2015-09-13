package com.sixwonders.courtkiosk;

import android.os.AsyncTask;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLConnection;
import java.lang.Exception;
import java.net.URLEncoder;
import java.util.ArrayList;

/**
 * Created by Katherine on 9/12/2015.
 */
public class ConnectionUtil {

    public void authCall(String firstName, String lastName, String dob, AsyncResponse asyncResponse){
        String callType="auth";
        String params ="";
        int count=0;
        if(!StringUtils.isEmpty(firstName)){
          params+="&firstName="+firstName;
          count++;
        }
        if(!StringUtils.isEmpty(lastName)){
            count++;
            if(count>0){
                params+="&";
            }
            params+="lastName="+lastName;
        }
        if(!StringUtils.isEmpty(dob)){
            if(count>0){
                params+="&";
            }
            params+="dob="+dob;
        }
        callWebService("/citation?json=1"+params, asyncResponse, callType);

//        return Adapter.adaptCitationData(jsonObjects);
    }

    public void continuationCall(String citationNo, AsyncResponse asyncResponse){
        String callType="cont";
        callWebService("/checkIn/continuation?citationNo="+citationNo, asyncResponse, callType);
    }

    public void completeCheckInCall(String citationNo, String courtLoc, String emailStr, String phoneNumberStr, AsyncResponse asyncResponse){
        String callType="complete";
        String param= null;
        try {
            param = "/checkIn/addToQueue?citationNo="+citationNo+"&courtLoc="+ URLEncoder.encode(courtLoc, "UTF-8");
        } catch (UnsupportedEncodingException e) {
        }
//        if(!StringUtils.isEmpty(phoneNumberStr)){
//            param+= "&phone="+phoneNumberStr;
//        }

        callWebService(param, asyncResponse, callType);
    }

    public void callWebService(String paramStr, AsyncResponse asyncResponse, String callType) {
        CallService cs = new CallService(asyncResponse,callType);
        cs.execute(paramStr);
    }

    class CallService extends AsyncTask<String, Void, Object> {

        private Exception exception;
        private AsyncResponse asyncResponse;
        private String callType;
        CallService(AsyncResponse responseHandler, String callType){
            asyncResponse=responseHandler;
            this.callType=callType;
        }
        @Override
        protected Object doInBackground(String... paramStrList) {
            String paramStr=null;
            for(String foo : paramStrList){
                paramStr=foo;
            }
            try {
                String baseUrl="http://infinite-meadow-7322.herokuapp.com";

                URL url = new URL(baseUrl + paramStr);
                URLConnection urlc = url.openConnection();
                BufferedReader bfr = new BufferedReader(new InputStreamReader(urlc.getInputStream()));
                String line;
                ArrayList<JSONObject> jsonList= new ArrayList<JSONObject>();
                while ((line = bfr.readLine()) != null) {
                    try{
                        JSONArray jsa = new JSONArray(line);
                        for (int i = 0; i < jsa.length(); i++) {
                            jsonList.add((JSONObject)jsa.get(i));
                        }
                    }catch(Exception e){
                        jsonList.add(new JSONObject(line));
                    }

                }
                return jsonList;
            }
            catch(Exception e){
                int i=0;
                i++;
                i++;
            }
            return null;
        }

        @Override
        protected void onPostExecute(Object result) {
            // TODO: check this.exception
            // TODO: do something with the feed
            asyncResponse.processFinish(callType ,result);
        }
    }
}