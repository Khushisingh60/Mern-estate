#include <bits/stdc++.h>
using namespace std;

// Trim function
string trim(const string &str) {
    size_t first = str.find_first_not_of(' ');
    if (first == string::npos) return "";
    size_t last = str.find_last_not_of(' ');
    return str.substr(first, (last - first + 1));
}

int MaxBooks(int N, int K, vector<int> &A) {
    vector<int> dp(N, 1);
    map<int, int> value_to_dp; // key = A[j], value = max dp[j]
    deque<pair<int, int>> window; // stores {A[j], dp[j]}

    int max_len = 1;

    for (int i = 0; i < N; ++i) {
        int curr = A[i];
        int max_dp = 0;

        // Iterate over all values < curr in map (map is sorted)
        auto it = value_to_dp.lower_bound(curr);
        for (auto itr = value_to_dp.begin(); itr != it; ++itr) {
            max_dp = max(max_dp, itr->second);
        }

        dp[i] = max_dp + 1;
        max_len = max(max_len, dp[i]);
        window.push_back({curr, dp[i]});
        value_to_dp[curr] = max(value_to_dp[curr], dp[i]);

        // Maintain sliding window of size K
        if (i >= K) {
            auto old = window.front(); window.pop_front();
            int val = old.first, old_dp = old.second;
            // Remove only if the dp value matches
            if (value_to_dp[val] == old_dp) {
                // Recalculate max dp[val] from remaining window
                int new_max = 0;
                for (const auto &p : window) {
                    if (p.first == val) new_max = max(new_max, p.second);
                }
                if (new_max > 0) value_to_dp[val] = new_max;
                else value_to_dp.erase(val);
            }
        }
    }

    return max_len;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);
    string inputline;

    getline(cin, inputline);
    int N = stoi(trim(inputline));
    getline(cin, inputline);
    int K = stoi(trim(inputline));

    vector<int> A(N);
    for (int i = 0; i < N; i++) {
        getline(cin, inputline);
        A[i] = stoi(trim(inputline));
    }

    int result = MaxBooks(N, K, A);
    cout << result << "\n";
    return 0;
}
