import java.util.*;

class Solution {
    public int minimumTeachings(int n, int[][] languages, int[][] friendships) {
        // Let m = number of users, k = average languages per user
        // Time: O(m * k) for this section
        Map<Integer, Set<Integer>> userLanguages = new HashMap<>();
        for (int i = 0; i < languages.length; i++) {
            userLanguages.put(i + 1, new HashSet<>());
            for (int lang : languages[i]) {
                userLanguages.get(i + 1).add(lang);
            }
        }

        // Let f = number of friendships
        // Time: O(f * k) for friendship processing
        Set<Integer> usersNeedingHelp = new HashSet<>();
        for (int[] friendship : friendships) {
            int userA = friendship[0];
            int userB = friendship[1];

            // Check if users have any common language
            Set<Integer> languagesA = userLanguages.get(userA);
            Set<Integer> languagesB = userLanguages.get(userB);
            boolean canCommunicate = false;
            for (int lang : languagesA) {
                if (languagesB.contains(lang)) {
                    canCommunicate = true;
                    break;
                }
            }

            // Add users to the set if they cannot communicate
            if (!canCommunicate) {
                usersNeedingHelp.add(userA);
                usersNeedingHelp.add(userB);
            }
        }

        // Let u = number of users needing help
        // Time: O(u * k) for frequency counting
        Map<Integer, Integer> languageFrequency = new HashMap<>();
        for (int user : usersNeedingHelp) {
            for (int lang : userLanguages.get(user)) {
                languageFrequency.put(lang, languageFrequency.getOrDefault(lang, 0) + 1);
            }
        }

        // Time: O(n) where n is number of languages
        // Find max frequency and return result
        int maxUsersWithOneLanguage = 0;
        for (int freq : languageFrequency.values()) {
            maxUsersWithOneLanguage = Math.max(maxUsersWithOneLanguage, freq);
        }

        // Calculate the minimum number of users to teach
        int minUsersToTeach = usersNeedingHelp.size() - maxUsersWithOneLanguage;
        return minUsersToTeach;
    }
}


/*

Total Time Complexity: O(m*k + f*k + u*k + n) where:

m = number of users
k = average number of languages per user
f = number of friendships
u = number of users needing help (≤ m)
n = total number of languages
Space Complexity: O(m*k + u)

O(m*k) for userLanguages map
O(u) for usersNeedingHelp set
O(n) for languageFrequency map
Worst Case Scenario:

When all users need to learn a new language: u = m
When each friendship pair can't communicate: O(f) operations
Total worst-case time complexity becomes O(m*k + f*k)
This analysis assumes hash map/set operations are O(1) average case.
*/