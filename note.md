class Solution {
    /*
        Final Time Complexity: O(n + k)

        n: length of input string
        k: number of knowledge pairs
    */
    public String evaluate(String s, List<List<String>> knowledges) {
        HashMap<String, String> mapWord = new HashMap<>();

        for(List<String> knowledge : knowledges)
        {
            mapWord.put(knowledge.get(0), knowledge.get(1));   
        }
        
        boolean isOpenBracket = false;
        StringBuilder currStr = new StringBuilder();

        StringBuilder result = new StringBuilder();
        for(Character ch : s.toCharArray()){
            if(ch == '('){
                isOpenBracket = true;
            }   
            else if(ch == ')'){
                String word = mapWord.getOrDefault(currStr.toString(), "?");
                result.append(word);
                isOpenBracket = false;
                currStr = new StringBuilder();
            }
            else{
                if(isOpenBracket){
                    currStr.append(ch);
                }
                else{
                    result.append(ch);
                }
            }
        }

        return result.toString();
    }
}