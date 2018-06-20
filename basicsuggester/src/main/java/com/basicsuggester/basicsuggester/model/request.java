package com.basicsuggester.basicsuggester.model;

import java.util.Objects;

public class request {
    private String val;

    public request() {
    }

    public request(String val) {
        this.val = val;
    }

    public String getVal() {
        return val;
    }

    public void setVal(String val) {
        this.val = val;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        request request = (request) o;
        return Objects.equals(getVal(), request.getVal());
    }

    @Override
    public int hashCode() {

        return Objects.hash(getVal());
    }
}
