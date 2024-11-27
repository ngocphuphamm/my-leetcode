class Solution {
    /**
     * Time Complexity: O(n * m) where:
     * n = length of string a
     * m = length of string b
     * - Building string takes O(m) time
     * - isSubstring check takes O(n * m) time
     * Space Complexity: O(m) for StringBuilder
     */
    public int repeatedStringMatch(String a, String b) {
        int count = 1;
        StringBuilder tempA = new StringBuilder(a);

        while (tempA.length() < b.length()) {
            tempA.append(a);
            count++;
        }

        if (isSubstring(tempA.toString(), b)) {
            return count;
        }

        tempA.append(a);
        count++;

        if (isSubstring(tempA.toString(), b)) {
            return count;
        }
        return -1;
    }

    /**
     * Time Complexity: O(n * m) where:
     * n = length of string a
     * m = length of string b
     * - Outer loop runs n-m+1 times
     * - substring and equals operations take O(m) time
     * Space Complexity: O(1)
     */
    public boolean isSubstring(String a, String b) {
        for (int i = 0; i <= a.length() - b.length(); i++) {
            if (a.substring(i, i + b.length()).equals(b)) {
                return true;
            }
        }
        return false;

    }
}
