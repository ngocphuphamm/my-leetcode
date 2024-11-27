class Solution {
    /**
     * Time Complexity: O(n * m * k)
     * where n = length of dictionary
     *       m = average length of words in dictionary
     *       k = length of string s
     * Space Complexity: O(1) - only uses a single String variable
     */
    public String findLongestWord(String s, List<String> dictionary) {
        String currString = "";
        for (String word : dictionary) {
            if (isSubsequence(s, word)) {
                if (currString.length() < word.length()) {
                    currString = word;
                } else {
                    int result = currString.compareTo(word);
                    if (currString.length() == word.length() && result >= 1) {
                        currString = word;
                    }
                }
            }
        }
        return currString;
    }

    /**
     * Time Complexity: O(k)
     * where k = length of string a (the longer string)
     * Space Complexity: O(1) - only uses two pointers
     */
    public boolean isSubsequence(String a, String b) {
        int i = 0, j = 0;
        while (i < a.length() && j < b.length()) {
            while (i < a.length() && a.charAt(i) != b.charAt(j)) {
                i++;
            }
            if(i == a.length()) return false;
            i++;
            j++;

        }
      
        return j == b.length();
    }
}