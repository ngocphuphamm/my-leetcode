class Solution {
    String strOfX = "ab";
    String strOfY = "ba";

    // Time: O(n) - single pass through input string
    // Space: O(1) - only comparing string pairs
    public int maximumGain(String s, int x, int y) {
        if(x > y){
            return maximumGain(s, x, y, strOfX, strOfY);
        }
        else{
            return maximumGain(s, y, x, strOfY, strOfX);    
        }
    }

    // Time: O(n) where n is length of input string s
    // Space: O(n) for stack storage
    public int maximumGain(String s, int firstPoint, int secondPoint, String first, String second){
        Stack<Character> stack = new Stack<Character>(); // O(n) space
        int result = 0;
        
        // First pass: O(n)
        for(Character ch : s.toCharArray()){            // O(n) iteration
            if(!stack.isEmpty()){                       // O(1) check
                String curStr = "" + stack.peek() + ch; // O(1) operation
                if(curStr.equals(first)){              // O(1) comparison
                    result += firstPoint;               // O(1) arithmetic
                    stack.pop();                        // O(1) operation
                    continue;
                }
            }
            stack.add(ch);                             // O(1) operation
        }

        // Building intermediate string: O(k) where k ≤ n
        StringBuilder strAfterRemoveFirst = new StringBuilder();
        for(Character ch: stack){                      // O(k) iteration
            strAfterRemoveFirst.append(ch);            // O(1) operation
        }

        // Second pass: O(k)
        stack.clear();                                 // O(1) operation
        for(Character ch : strAfterRemoveFirst.toString().toCharArray()){ // O(k) iteration
            if(!stack.isEmpty()){                      // O(1) check
                String curStr = "" + stack.peek() + ch; // O(1) operation
                if(curStr.equals(second)){             // O(1) comparison
                    result += secondPoint;              // O(1) arithmetic
                    stack.pop();                        // O(1) operation
                    continue;
                }
            }
            stack.add(ch);                             // O(1) operation
        }
        return result;
    }
}