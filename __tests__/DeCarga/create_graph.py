import json
import pandas as pd
import matplotlib.pyplot as plt

# Step 1: Load and process the data
data = []
with open('results.json', 'r') as f:
    for line in f:
        try:
            json_object = json.loads(line)
            if json_object.get('metric') == 'http_req_duration' and json_object.get('type') == 'Point':
                data.append(json_object['data']['value'])
        except json.JSONDecodeError:
            continue

# Step 2: Create a DataFrame
df = pd.DataFrame(data, columns=['value'])

# Step 3: Calculate statistics
mean = df['value'].mean()
median = df['value'].median()
p95 = df['value'].quantile(0.95)

# Step 4: Create the graph
plt.figure(figsize=(10, 6))
plt.hist(df['value'], bins=50, edgecolor='black')
plt.title('Distribution of HTTP Request Duration')
plt.xlabel('Duration (ms)')
plt.ylabel('Frequency')

# Step 5: Add vertical lines for key statistics
plt.axvline(mean, color='r', linestyle='dashed', linewidth=2, label=f"Mean: {mean:.2f} ms")
plt.axvline(median, color='g', linestyle='dashed', linewidth=2, label=f"Median: {median:.2f} ms")
plt.axvline(p95, color='b', linestyle='dashed', linewidth=2, label=f"95th percentile: {p95:.2f} ms")

plt.legend()

# Step 6: Save the graph
plt.savefig('http_req_duration_distribution.png')
plt.close()

print("Graph saved as 'http_req_duration_distribution.png'")