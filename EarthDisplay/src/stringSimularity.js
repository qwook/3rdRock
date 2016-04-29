var sSimilarity = function(sa1, sa2){
    // Compare two strings to see how similar they are.
    // Answer is returned as a value from 0 - 1
    // 1 indicates a perfect similarity (100%) while 0 indicates no similarity (0%)
    // Algorithm is set up to closely mimic the mathematical formula from
    // the article describing the algorithm, for clarity. 
    // Algorithm source site: http://www.catalysoft.com/articles/StrikeAMatch.html
    // (Most specifically the slightly cryptic variable names were written as such
    // to mirror the mathematical implementation on the source site)
    //
    // 2014-04-03
    // Found out that the algorithm is an implementation of the Sørensen–Dice coefficient [1]
    // [1] http://en.wikipedia.org/wiki/S%C3%B8rensen%E2%80%93Dice_coefficient
    //
    // The algorithm is an n-gram comparison of bigrams of characters in a string


    // for my purposes, comparison should not check case or whitespace
    var s1 = sa1.replace(/\s/g, "").toLowerCase();
    var s2 = sa2.replace(/\s/g, "").toLowerCase();
    
    function intersect(arr1, arr2) {
        // I didn't write this.  I'd like to come back sometime
        // and write my own intersection algorithm.  This one seems
        // clean and fast, though.  Going to try to find out where
        // I got it for attribution.  Not sure right now.
        var r = [], o = {}, l = arr2.length, i, v;
        for (i = 0; i < l; i++) {
            o[arr2[i]] = true;
        }
        l = arr1.length;
        for (i = 0; i < l; i++) {
            v = arr1[i];
            if (v in o) {
                r.push(v);
            }
        }
        return r;
    }
    
    var pairs = function(s){
        // Get an array of all pairs of adjacent letters in a string
        var pairs = [];
        for(var i = 0; i < s.length - 1; i++){
            pairs[i] = s.slice(i, i+2);
        }
        return pairs;
    }    
    
    var similarity_num = 2 * intersect(pairs(s1), pairs(s2)).length;
    var similarity_den = pairs(s1).length + pairs(s2).length;
    var similarity = similarity_num / similarity_den;
    return similarity;
};

export default sSimilarity;