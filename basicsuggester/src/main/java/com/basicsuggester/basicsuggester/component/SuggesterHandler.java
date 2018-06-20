package com.basicsuggester.basicsuggester.component;

import com.basicsuggester.basicsuggester.basic.BasicSpellCheck;
import com.basicsuggester.basicsuggester.model.request;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class SuggesterHandler {

    @RequestMapping(value = "/suggester",
            method = RequestMethod.PUT,
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> suggester(@RequestBody request toSuggester) {
        System.out.println(toSuggester.getVal());

        return new ResponseEntity<Object>(BasicSpellCheck.doThings(toSuggester.getVal()), HttpStatus.OK);
    }
}
