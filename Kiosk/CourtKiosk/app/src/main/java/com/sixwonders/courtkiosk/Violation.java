package com.sixwonders.courtkiosk;

import java.util.Date;

/**
 * Created by Katherine on 9/12/2015.
 */
public class Violation {

    private int citation_number;
    private String violation_number;
    private String violation_description;
    private String warrant_status;
    private String warrant_number;
    private String status;
    private Date status_date;
    private String fine_amount;
    private String court_cost;

    public int getCitation_number() {
        return citation_number;
    }

    public void setCitation_number(int citation_number) {
        this.citation_number = citation_number;
    }

    public String getViolation_number() {
        return violation_number;
    }

    public void setViolation_number(String violation_number) {
        this.violation_number = violation_number;
    }

    public String getViolation_description() {
        return violation_description;
    }

    public void setViolation_description(String violation_description) {
        this.violation_description = violation_description;
    }

    public String getWarrant_status() {
        return warrant_status;
    }

    public void setWarrant_status(String warrant_status) {
        this.warrant_status = warrant_status;
    }

    public String getWarrant_number() {
        return warrant_number;
    }

    public void setWarrant_number(String warrant_number) {
        this.warrant_number = warrant_number;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getStatus_date() {
        return status_date;
    }

    public void setStatus_date(Date status_date) {
        this.status_date = status_date;
    }

    public String getFine_amount() {
        return fine_amount;
    }

    public void setFine_amount(String fine_amount) {
        this.fine_amount = fine_amount;
    }

    public String getCourt_cost() {
        return court_cost;
    }

    public void setCourt_cost(String court_cost) {
        this.court_cost = court_cost;
    }

}
