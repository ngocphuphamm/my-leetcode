class Solution {
    // Time Complexity: O(mk + nk + nm) where:
    // m = length of words array
    // n = length of queries array 
    // k = average length of each string
    public int[] numSmallerByFrequency(String[] queries, String[] words) {
        HashMap<Integer, Integer> mapFreqOfWord = new HashMap<Integer, Integer>();
        
        // First loop: O(m*k)
        for(int i = 0; i < words.length; i++){
            String word = words[i];
            int freq = getFrequency(word); // O(k) for each word
            mapFreqOfWord.put(i, freq);    // O(1)
        }
        
        int n = queries.length;
        int[] result = new int[n];
        
        // Second loop: O(n*(k + m))
        for(int i = 0; i < n; i++){
            String query = queries[i];
            int freqOfQuery = getFrequency(query); // O(k)
            int count = 0;
            // Inner loop: O(m)
            for(int freq : mapFreqOfWord.values()){
                if(freq > freqOfQuery){
                    count++;
                }
            }
            result[i] = count;
        }
        return result;
    }

    // Time: O(k) where k is length of word
    // Space: O(1)
    public int getFrequency(String word){
        Character smallestCh = word.charAt(0);
        // First loop: O(k)
        for(Character ch : word.toCharArray()){
            if(smallestCh > ch){
                smallestCh = ch;
            }
        }
        int frequency = 0;
        // Second loop: O(k)
        for(Character ch : word.toCharArray()){
            if(ch == smallestCh){
               frequency++;
            }
        }
        return frequency;
    }
}