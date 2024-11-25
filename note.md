class Solution {
    public List<Integer> findLonely(int[] nums) {
        HashMap<Integer, Integer> mapFreq = new HashMap<Integer, Integer>();
        for(int num : nums){
            mapFreq.put(num, mapFreq.getOrDefault(num, 0) + 1);
        }
        List<Integer> result = new ArrayList<Integer>();
        for(int num : nums){
            if(mapFreq.getOrDefault(num, 0) > 1){
                continue;
            }
            int prevNum = num - 1;
            int nextNum = num + 1;
            if(mapFreq.containsKey(prevNum) || mapFreq.containsKey(nextNum)) continue;
            result.add(num);
        }
        return num;
    }
}