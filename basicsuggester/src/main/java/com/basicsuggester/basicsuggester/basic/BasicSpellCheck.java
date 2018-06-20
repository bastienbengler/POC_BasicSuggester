package com.basicsuggester.basicsuggester.basic;

import com.softcorporation.suggester.BasicSuggester;
import com.softcorporation.suggester.Suggestion;
import com.softcorporation.suggester.dictionary.BasicDictionary;
import com.softcorporation.suggester.tools.SpellCheck;
import com.softcorporation.suggester.util.Constants;
import com.softcorporation.suggester.util.SpellCheckConfiguration;

import java.io.*;
import java.util.*;

public class BasicSpellCheck
{

    public static ArrayList<String> doThings(String text) {
        ArrayList<String> suggestions = new ArrayList<>();
        try
        {
            long memory0;
            long memory1;

            // get start times
            long time0;
            long time1;


            String dictFileName = "file://src/main/resources/dic/fr.jar";

            System.out.println("Loading dictionary ...");
            memory0 = getMemory();
            time0 = System.currentTimeMillis();

            BasicDictionary dictionary = new BasicDictionary(dictFileName);

            time1 = System.currentTimeMillis();
            memory1 = getMemory();
            System.out.println("Done. It took " + (time1 - time0) +
                    " milliseconds. Used memory: " + (memory1 - memory0) +
                    "\n");

            SpellCheckConfiguration configuration = new SpellCheckConfiguration(
                    "file://src/main/resources/config/spellCheck.config");


            BasicSuggester suggester = new BasicSuggester(configuration);
            suggester.attach(dictionary);




            System.out.println("\ntext: " + text);

            time0 = System.currentTimeMillis();

            SpellCheck spellCheck = new SpellCheck(configuration);
            spellCheck.setSuggester(suggester);
            spellCheck.setSuggestionLimit(10);

            spellCheck.setText(text);
            spellCheck.check();


            String misspeltWord = spellCheck.getMisspelt();
            String misspeltText = spellCheck.getMisspeltText(5, "<b>", "</b>",
                    5);
            System.out.println("Misspelt text: " + misspeltText);
            System.out.println("Misspelt word: " + misspeltWord);

            suggestions = spellCheck.getSuggestions();
        }
        catch (Exception e)
        {
            System.out.println("Error: " + e);
        }
        return suggestions;

    }

    // Note, this is not valid method to measure memory size, but it can give you some estimate
    static long getMemory()
    {
        try
        {
            System.gc();
            System.gc();
            Thread.yield();
            System.gc();
            System.gc();
            Thread.sleep(100);
            System.gc();
            System.gc();
        }
        catch (Exception e)
        {}
//    System.out.println("TotalMemory=" + Runtime.getRuntime().totalMemory());
//    System.out.println("FreeMemory=" + Runtime.getRuntime().freeMemory());
        return Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory();
    }

}
