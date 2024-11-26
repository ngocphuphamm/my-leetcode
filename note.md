class Solution {
    public List<Integer> peopleIndexes(List<List<String>> favoriteCompanies) {
        HashMap<String, Integer> mapFreq = new HashMap<String, Integer>();
        HashMap<Integer, Set<String>> mapCompanies = new HashMap<Integer, Set<String>>();
        for (int i = 0; i < favoriteCompanies.size(); i++) {
            List<String> companies  = favoriteCompanies.get(i);
            Set<String> setCompanies = new HashSet<String>();
            for (String company : companies) {
                setCompanies.add(company);
                mapFreq.put(company, mapFreq.getOrDefault(company, 0) + 1);
            }
            mapCompanies.put(i, setCompanies);
        }
        List<Integer> result = new ArrayList<Integer>();
        for (int i = 0; i < favoriteCompanies.size(); i++) {
            List<String> companies = favoriteCompanies.get(i);
            boolean isUnique = false;
            for (String company : companies) {
                if (mapFreq.get(company) == 1) {
                    result.add(i);
                    isUnique = true;
                    break;
                }
            }
            if(!isUnique){
                boolean isAdd = true;
                for(Map.Entry<Integer, Set<String>>entry : mapCompanies.entrySet()){
                    if(entry.getKey() == i)continue;

                    Set<String> setCompanies = entry.getValue();
                    int count = 0;
                    for(String company : companies){
                        if(setCompanies.contains(company)){
                            count++;
                        }
                    }
                    if(setCompanies.size() > count && count == companies.size()){
                        isAdd = false;
                        break;
                    }
                }

                if(isAdd){
                    result.add(i);
                }
            }
        }
        return result;
    }
}


