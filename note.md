class Solution {
    /**
     * Time Complexity Analysis:
     * - Binary Search Range: O(log M) where M is max(bloomDay) - min(bloomDay)
     * - For each binary search iteration, we call canMakeBouquet which is O(n)
     * - Total Time Complexity: O(n * log M) where n is length of bloomDay array
     */
    public int minDays(int[] bloomDay, int m, int k) {
        int left = Integer.MAX_VALUE, right = Integer.MIN_VALUE;
        for(int day : bloomDay){
            left = Math.min(day, left);
            right = Math.max(day, right);
        }
        
        while(left < right){
            int mid = left  + (right - left ) /2;
            if(canMakeBouquet(bloomDay, mid, m, k)){
                right = mid;
            }
            else{
                left = mid + 1;
            }
        }
        
        // check because in range left < right we can't meet case satisfy therefore end time left = mid + 1; 
        // we check more. Is left valid condition 
        return !canMakeBouquet(bloomDay, left, m, k) ? -1 : left;
    }

    /**
     * Time Complexity: O(n)
     * - Single pass through the bloomDay array
     * Space Complexity: O(1)
     * - Only uses constant extra space
     */
    public boolean canMakeBouquet(int[] bloomDay, int currDay,int totalBouquet, int k){
        int flowers = 0, currBouquet = 0;
        for(int day : bloomDay){
            if(day <= currDay){
                flowers++;
                if(flowers == k){
                    currBouquet++;
                    flowers =0;
                }
            }
            else{
                flowers = 0;
            }
        }

        return currBouquet >= totalBouquet;
    }
}
