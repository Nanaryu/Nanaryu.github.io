const serverData = [{"ip": "67.205.136.38", "port": 4000, "name": "North America 1", "region": 1, "version": 69, "visible": "true", "languages": "", "characters_online": 394}, {"ip": "192.241.213.34", "port": 4000, "name": "North America 2", "region": 1, "version": 69, "visible": "true", "languages": "es", "characters_online": 65}, {"ip": "165.227.116.252", "port": 4000, "name": "North America 3", "region": 1, "version": 69, "visible": "true", "languages": "", "characters_online": 66}, {"ip": "104.248.70.123", "port": 4000, "name": "North America 4", "region": 1, "version": 69, "visible": "true", "languages": "en,fr", "characters_online": 69}, {"ip": "192.241.185.164", "port": 4000, "name": "North America 5", "region": 1, "version": 69, "visible": "true", "languages": "es", "characters_online": 64}, {"ip": "137.184.37.179", "port": 4000, "name": "North America 6", "region": 1, "version": 69, "visible": "true", "languages": "es", "characters_online": 199}, {"ip": "165.22.86.15", "port": 4000, "name": "Europe 1", "region": 2, "version": 69, "visible": "true", "languages": "ru", "characters_online": 141}, {"ip": "167.71.8.250", "port": 4000, "name": "Europe 2", "region": 2, "version": 69, "visible": "true", "languages": "pl", "characters_online": 62}, {"ip": "82.196.8.119", "port": 4000, "name": "Europe 3", "region": 2, "version": 69, "visible": "true", "languages": "fr", "characters_online": 59}, {"ip": "188.166.7.70", "port": 4000, "name": "Europe 4", "region": 2, "version": 69, "visible": "true", "languages": "tr", "characters_online": 43}, {"ip": "104.248.44.233", "port": 4000, "name": "Europe 5", "region": 2, "version": 69, "visible": "true", "languages": "de", "characters_online": 73}, {"ip": "164.90.174.224", "port": 4000, "name": "Europe 6", "region": 2, "version": 69, "visible": "true", "languages": "es", "characters_online": 76}, {"ip": "18.228.118.214", "port": 4000, "name": "South America 1", "region": 3, "version": 69, "visible": "true", "languages": "pt", "characters_online": 286}, {"ip": "18.231.13.50", "port": 4000, "name": "South America 2", "region": 3, "version": 69, "visible": "true", "languages": "pt", "characters_online": 94}, {"ip": "54.233.229.27", "port": 4000, "name": "South America 3", "region": 3, "version": 69, "visible": "true", "languages": "es", "characters_online": 80}, {"ip": "52.67.162.81", "port": 4000, "name": "South America 4", "region": 3, "version": 69, "visible": "true", "languages": "pt", "characters_online": 91}, {"ip": "18.231.117.69", "port": 4000, "name": "South America 5", "region": 3, "version": 69, "visible": "true", "languages": "pt", "characters_online": 105}, {"ip": "54.207.112.163", "port": 4000, "name": "South America 6", "region": 3, "version": 69, "visible": "true", "languages": "pt", "characters_online": 96}, {"ip": "15.228.123.59", "port": 4000, "name": "South America 7", "region": 3, "version": 69, "visible": "true", "languages": "pt", "characters_online": 98}, {"ip": "15.228.63.38", "port": 4000, "name": "South America 8", "region": 3, "version": 69, "visible": "true", "languages": "pt", "characters_online": 155}, {"ip": "128.199.66.110", "port": 4000, "name": "Asia 1", "region": 4, "version": 69, "visible": "true", "languages": "in", "characters_online": 40}, {"ip": "159.65.1.161", "port": 4000, "name": "Asia 2", "region": 4, "version": 69, "visible": "true", "languages": "en", "characters_online": 32}, {"ip": "128.199.239.146", "port": 4000, "name": "Asia 3", "region": 4, "version": 69, "visible": "true", "languages": "vi", "characters_online": 26}, {"ip": "167.71.202.95", "port": 4000, "name": "Asia 4", "region": 4, "version": 69, "visible": "true", "languages": "", "characters_online": 51}]


var xhr = new XMLHttpRequest();
xhr.open("GET", "http://www.rucoyonline.com/server_list.json", true);

xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    var response = xhr.responseText;
    console.log(response);
  }
};

xhr.send();


  // Function to generate an HTML table for a single server
  function generateServerTable(server) {
    const table = document.getElementById("main-table");
    table.innerHTML += `
      <tr class="server-info">
        <td class="server-name" id="name-${server.name}">${server.name}</td>
        <td class="server-chars" id="chars-${server.name}">${server.characters_online}</td>
      </tr>
    `;
    /* <td class="server-ip">${server.ip}</td>
        <td class="server-port">${server.port}</td>
        <td class="server-region">${server.region}</td>
        <td class="server-lang">${server.languages}</td> */
    return table;
  }
  
  // Function to add server tables to the document
  function addServerTables(data) {
    const serverListDiv = document.getElementById('server-list');
    data.forEach(server => {
      const table = generateServerTable(server);
      const charsCell = document.getElementById(`chars-${server.name}`);
      const nameCell = document.getElementById(`name-${server.name}`)
      if (charsCell.innerHTML >= 250)
      {
        charsCell.style.backgroundColor = "red"
        nameCell.style.backgroundColor = "red"
      } 
      else if (charsCell.innerHTML < 250 && charsCell.innerHTML > 100)
      {
        charsCell.style.backgroundColor = "#ffcc00"
        nameCell.style.backgroundColor = "#ffcc00"
      }
      else if (charsCell.innerHTML <= 100 && charsCell.innerHTML > 50)
      {
        charsCell.style.backgroundColor = "green"
        nameCell.style.backgroundColor = "green"
      }
      else if (charsCell.innerHTML <= 50)
      {
        charsCell.style.backgroundColor = "#0099ff"
        nameCell.style.backgroundColor = "#0099ff"
      }
      serverListDiv.appendChild(table);
    });
  }
  
  // Call the function to generate and add the server tables to the document
  addServerTables(serverData);