1190. Reverse Substrings Between Each Pair of Parentheses
Solved
Medium
Topics
Companies
Hint
You are given a string s that consists of lower case English letters and brackets.

Reverse the strings in each pair of matching parentheses, starting from the innermost one.

Your result should not contain any brackets.

 

Example 1:

Input: s = "(abcd)"
Output: "dcba"
Example 2:

Input: s = "(u(love)i)"
Output: "iloveu"
Explanation: The substring "love" is reversed first, then the whole string is reversed.
Example 3:

Input: s = "(ed(et(oc))el)"
Output: "leetcode"
Explanation: First, we reverse the substring "oc", then "etco", and finally, the whole string.
 

Constraints:

1 <= s.length <= 2000
s only contains lower case English characters and parentheses.
It is guaranteed that all parentheses are balanced.

stack<string>

track condition  

cote

cote
co
et
te
co
octe
oc => co push stack 
et 
"("
ed
"("

currStrr = ed 




class Solution {
    public String reverseParentheses(String s) {
        Stack<StringBuilder> stack = new Stack<StringBuilder>();
        StringBuilder currString = new StringBuilder();
        for(int i = 0; i < s.length(); i++){
            Character ch = s.charAt(i);
            if(ch == '('){
                stack.add(currString);
                currString = new StringBuilder();
            }
            else if(ch == ')'){
                StringBuilder reverseString = currString.reverse();
                if(!stack.isEmpty()){
                    currString = stack.pop();
                }
                currString.append(reverseString);
            }
            else{
                currString.append(ch);
            }
        }    
        return currString.toString();   
    }
}
