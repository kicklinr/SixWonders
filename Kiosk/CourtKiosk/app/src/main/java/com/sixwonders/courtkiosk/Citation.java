package com.sixwonders.courtkiosk;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;

/**
 * Created by Katherine on 9/12/2015.
 */
public class Citation implements Serializable {
    private int citation_number;
    private String citation_date;
    private String first_name;
    private String last_name;
    private String date_of_birth;
    private String defendant_address;
    private String defendant_city;
    private String defendant_state;
    private String drivers_license_number;
    private String court_date;
    private String court_location;
    private String court_address;
    private ArrayList<Violation> violations = new ArrayList<Violation>();

    public int getCitation_number() {
        return citation_number;
    }

    public void setCitation_number(int citation_number) {
        this.citation_number = citation_number;
    }

    public String getCitation_date() {
        return citation_date;
    }

    public void setCitation_date(String citation_date) {
        this.citation_date = citation_date;
    }

    public String getFirst_name() {
        return first_name;
    }

    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }

    public String getDate_of_birth() {
        return date_of_birth;
    }

    public void setDate_of_birth(String date_of_birth) {
        this.date_of_birth = date_of_birth;
    }

    public String getDefendant_address() {
        return defendant_address;
    }

    public void setDefendant_address(String defendant_address) {
        this.defendant_address = defendant_address;
    }

    public String getDefendant_city() {
        return defendant_city;
    }

    public void setDefendant_city(String defendant_city) {
        this.defendant_city = defendant_city;
    }

    public String getDefendant_state() {
        return defendant_state;
    }

    public void setDefendant_state(String defendant_state) {
        this.defendant_state = defendant_state;
    }

    public String getDrivers_license_number() {
        return drivers_license_number;
    }

    public void setDrivers_license_number(String drivers_license_number) {
        this.drivers_license_number = drivers_license_number;
    }

    public String getCourt_date() {
        return court_date;
    }

    public void setCourt_date(String court_date) {
        this.court_date = court_date;
    }

    public String getCourt_location() {
        return court_location;
    }

    public void setCourt_location(String court_location) {
        this.court_location = court_location;
    }

    public String getCourt_address() {
        return court_address;
    }

    public void setCourt_address(String court_address) {
        this.court_address = court_address;
    }

    public ArrayList<Violation> getViolations() {
        return violations;
    }

    public void setViolations(ArrayList<Violation> violations) {
        this.violations = violations;
    }
}
