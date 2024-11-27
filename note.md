class Solution {
    public int numOfSubarrays(int[] arr, int k, int threshold) {
        int wdStart = 0;
        int sum = 0; 
        int count = 0;
        for(int wdEnd = 0; i < arr.length; wdEnd++){
            sum += arr[wdEnd];
            if(wdEnd >= k){
                int average = sum / k;
                if(average >= threshold){
                    count++;
                }
                sum -= arr[wdStart];
                wdStart++;
            }
        }
        return count;
    }
}