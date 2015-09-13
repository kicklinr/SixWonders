package com.sixwonders.courtkiosk;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

/**
 * Created by Katherine on 9/12/2015.
 */
public class CitationAdapter {

    public static ArrayList<Citation> adaptCitationData(ArrayList<JSONObject> jsonObjects){
        ArrayList<Citation> citations = new ArrayList<Citation>();
        try {
            for (JSONObject jsonObject:jsonObjects){
                Citation citation = new Citation();
                //id,,,,,date_of_birth,defendant_address,defendant_city,defendant_state,drivers_license_number,court_date,court_location,court_address
                if(jsonObject.getInt("citation_number")!=0){
                    citation.setCitation_number(jsonObject.getInt("citation_number"));
                }
                if(!StringUtils.isEmpty(jsonObject.get("citation_date").toString())){
                    citation.setCitation_date(StringUtils.split(jsonObject.getString("citation_date"), ' ')[0]);
                }
                if(!StringUtils.isEmpty(jsonObject.get("first_name").toString())){
                    citation.setFirst_name(jsonObject.getString("first_name"));
                }
                if(!StringUtils.isEmpty(jsonObject.get("last_name").toString())){
                    citation.setFirst_name(jsonObject.getString("last_name"));
                }
                if(!StringUtils.isEmpty(jsonObject.get("court_location").toString())){
                    citation.setCourt_location(jsonObject.getString("court_location"));
                }
                citations.add(citation);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return citations;
    }
}
