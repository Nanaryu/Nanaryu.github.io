const url = 'data.json'; // Replace with the path to your JSON file
const serverData = []
fetch(url)
  .then(response => response.json())
  .then(data => {
    serverData = data; // Set the JSON data as a constant or variable
    console.log(jsonData); // You can now use jsonData in your code
  })
  .catch(error => {
    console.error('Error:', error);
  });
  
  // Function to generate an HTML table for a single server
  function generateServerTable(server) {
    const table = document.createElement('table');
    table.className = "server-info"
    table.innerHTML = `
      <tr>
        <th>Server Name</th>
        <th>IP Address</th>
        <th>Port</th>
        <th>Region</th>
        <th>Languages</th>
        <th>Characters Online</th>
      </tr>
      <tr>
        <td>${server.ip}</td>
        <td>${server.port}</td>
        <td>${server.name}</td>
        <td>${server.region}</td>
        <td>${server.languages}</td>
        <td>${server.characters_online}</td>
      </tr>
    `;
    return table;
  }
  
  // Function to add server tables to the document
  function addServerTables(data) {
    const serverListDiv = document.getElementById('server-list');
    data.forEach(server => {
      const table = generateServerTable(server);
      serverListDiv.appendChild(table);
    });
  }
  
  // Call the function to generate and add the server tables to the document
  addServerTables(serverData);
