2260. Minimum Consecutive Cards to Pick Up
Medium
Topics
Companies
Hint
You are given an integer array cards where cards[i] represents the value of the ith card. A pair of cards are matching if the cards have the same value.

Return the minimum number of consecutive cards you have to pick up to have a pair of matching cards among the picked cards. If it is impossible to have matching cards, return -1.

 

Example 1:
                0 1 2 3 
Input: cards = [4,3,1,2,0,2,7,7]
Output: 4
Explanation: We can pick up the cards [3,4,2,3] which contain a matching pair of cards with value 3. Note that picking up the cards [4,2,3,4] is also optimal.
Example 2:

Input: cards = [1,0,5,3]
Output: -1
Explanation: There is no way to pick up a set of consecutive cards that contain a pair of matching cards.
 

Constraints:

1 <= cards.length <= 105
0 <= cards[i] <= 106


class Solution {
    public int[] findOriginalArray(int[] changed) {
        int[] result = new int[changed.length / 2];
        if(result.length == 0) return  result;

        Arrays.sort(changed);
        HashMap<Integer, Integer> mapFreq = new HashMap<Integer, Integer>();
        for(int number : changed){
            mapFreq.put(number, mapFreq.getOrDefault(number, 0) + 1);
        }
        int k = result.length - 1;
        for(int i = changed.length - 1; i >= (changed.length / 2); i--){
            int numberFind = changed[i] / 2; 
            if(mapFreq.containsKey(numberFind)){
                if(numberFind == changed[i] && mapFreq.get(numberFind) == 1){
                return new int[changed.length / 2];
                    
                }
                result[k] = numberFind; 
            }
            else{
                return new int[changed.length / 2];
            }
            k--;
        }
        return result;
    }
}




