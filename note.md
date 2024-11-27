/*
Time Complexity (TC): O(k * m log m)
Where k is the number of unique people, and m is the number of key-card usage times per person. Sorting the times for each person takes O(m log m) time, and the algorithm checks each person’s usage data.

Space Complexity (SC): O(k * m)
The space is used to store the usage times for each person in the mapNameRefTime HashMap and the sorted list of times.
 */
class Solution {
    class Time {
        int hour;
        int min;

        Time(int hour, int min) {
            this.hour = hour;
            this.min = min;
        }

        public int toMinutes() {
            return hour * 60 + min;
        }
    }

    public List<String> alertNames(String[] keyName, String[] keyTime) {
        int n = keyName.length;
        HashMap<String, List<Time>> mapNameRefTime = new HashMap<>();

        // Step 1: Organize the data by name
        for (int i = 0; i < n; i++) {
            String[] timeParts = keyTime[i].split(":");
            int hour = Integer.parseInt(timeParts[0]);
            int min = Integer.parseInt(timeParts[1]);
            Time time = new Time(hour, min);
            mapNameRefTime.computeIfAbsent(keyName[i], k -> new ArrayList<>()).add(time);
        }

        List<String> result = new ArrayList<>();
        
        // Step 2: Check for 3 usages within an hour for each person
        for (Map.Entry<String, List<Time>> entry : mapNameRefTime.entrySet()) {
            List<Time> listTime = entry.getValue();
            Collections.sort(listTime, (a, b) -> a.toMinutes() - b.toMinutes());
            
            // Step 3: Use a sliding window to find if there are 3 usages within an hour
            for (int i = 0; i <= listTime.size() - 3; i++) {
                int diffTime = listTime.get(i + 2).toMinutes() - listTime.get(i).toMinutes();
                if (diffTime <= 60) {
                    result.add(entry.getKey());
                    break; // No need to check further, we found 3 usages in 1 hour
                }
            }
        }

        Collections.sort(result);
        return result;
    }
}