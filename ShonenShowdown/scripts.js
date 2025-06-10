let allCharacter = [
    {["title"]: "blah"},
    {["title"]: "blah1"},
    {["title"]: "blah2"},
    {["title"]: "blah3"},
    {["title"]: "blah4"},
    {["title"]: "blah5"},
    {["title"]: "blah6"},
    {["title"]: "blah7"},
    {["title"]: "blah8"}
];
let currentCharacter = null;
let team1 = {
    ["Captain"]: false,
    ["Vice-Captain"]:false,
    ["Tank"]:false,
    ["Healer"]:false,
    ["Support1"]:false,
    ["Support2"]:false,
};
let team2 = {
    ["Captain"]: false,
    ["Vice-Captain"]:false,
    ["Tank"]:false,
    ["Healer"]:false,
    ["Support1"]:false,
    ["Support2"]:false,
};
let currentTeam = 0
async function populate() {
    const requestURL =
        "https://raw.githubusercontent.com/ShadowLeaderJordanzo/ShonenShowdown/refs/heads/main/characters.json";
    const request = new Request(requestURL);
    const response = await fetch(request);
    allCharacter = await response.json();
}
populate();

function resetTeams() {
    team1 = {
        ["Captain"]: false,
        ["Vice-Captain"]:false,
        ["Tank"]:false,
        ["Healer"]:false,
        ["Support1"]:false,
        ["Support2"]:false,
    };
    team2 = {
        ["Captain"]: false,
        ["Vice-Captain"]:false,
        ["Tank"]:false,
        ["Healer"]:false,
        ["Support1"]:false,
        ["Support2"]:false,
    };
    currentCharacter = null;
    currentTeam = 0;
    updateTeamDisplay(1);
    updateTeamDisplay(2);

}


async function getImage(title) {
        let fixedUrl  = title.split("/wiki/")[1];
        const url = `https://onepiece.fandom.com/api.php?action=query&format=json&origin=*&prop=pageimages&titles=${fixedUrl}&pithumbsize=300`;

        try {
            const res = await fetch(url);
            const data = await res.json();
            const pages = data.query.pages;

            for (const pageId in pages) {
                const page = pages[pageId];
                if (page.thumbnail && page.thumbnail.source) {
                    return page.thumbnail.source;
                }
            }

            return "https://placehold.co/300x300.png"
        } catch (e) {
            console.error(e);
            return "https://placehold.co/300x300.png"
        }
    }



async function rollCharacter(doNotSwap) {
    let selectedIndexes = []
    let chars = []
    let index = 1
    let rolls = document.getElementById('rollCount').value
    if(currentTeam == 0) {
        currentTeam = 1
        doNotSwap = true
    }
    Array.from(document.getElementById("currentCharacter").children).forEach(element => {
        if(index > rolls) {
            element.remove()
        }
        index++
    });



    for (let i = 1; i <= document.getElementById('rollCount').value; i++) {
        let index = Math.floor(Math.random() * allCharacter.length);
        if(selectedIndexes.includes(index)) {
            i--
            continue
        }
        selectedIndexes.push(index);
        currentCharacter = allCharacter[index];
        let img = await getImage(currentCharacter.url);
        chars.push({currentCharacter, img, index})
        
    }
    for (let i = 1; i <= document.getElementById('rollCount').value; i++) {
        let charHolder = document.getElementById("currentCharacter");
        let charDiv = document.getElementById(`character${i}`)
        if(!charDiv) {
            charDiv = document.createElement("div")
            charDiv.id=`character${i}`
            charHolder.appendChild(charDiv)
        }
        let data = chars[i-1];
        charDiv.innerHTML = `
            <h3>${data.currentCharacter.name}</h3>
            <a href="${data.currentCharacter.url}" target="_blank">
                <img src="${data.img}" width="100">
            </a>
            <button onclick='pickCharacter(${data.index})'>Select</button>
        `;

        charDiv.style.width = `${100/rolls}%`;

    }
    if(!doNotSwap) {
        let div = document.getElementById(`team${currentTeam}`);
        div.style.backgroundColor = "black";
        currentTeam = currentTeam === 1 ? 2 : 1;
    }
    document.getElementById(`team${currentTeam}`).style.backgroundColor = "yellow";
}


async function pickCharacter(theChar) {
    let char = allCharacter[theChar]
    let img = await getImage(currentCharacter.url);
    currentCharacter = {char, img}
    console.log(theChar)
}

function assignToTeam(position, teamNumber) {
    if(currentCharacter == false || currentCharacter == null) return;
    if(currentTeam != teamNumber) return;
    if(teamNumber == 1) {
        if(team1[position] != false) return;
        team1[position] = currentCharacter;
        updateTeamDisplay(1);

    } else {
        if(team2[position] != false) return;
        team2[position] = currentCharacter;
        updateTeamDisplay(2);
    }
    currentCharacter = false;
    rollCharacter();
}








function updateTeamDisplay(teamNumber) {
    const list = document.getElementById(`team${teamNumber}List`);
    if(teamNumber == 1) {
        for (const key in team1) {
            if (Object.prototype.hasOwnProperty.call(team1, key)) {
                const element = team1[key];
                let ele = document.getElementById(`${key}${teamNumber}`)
                if(element == false) return;
                if(ele) {
                    ele.innerHTML = `
                        <li>
                            <center>
                                <button onclick="assignToTeam('${key}',1)">
                                    Captain
                                </button>
                            </center>
                            <div>
                                <a href=${element.char.url}><img src="${element.img}"></a>
                            </div>
                            <center>
                            <p>${element.char.name}</p>
                            </center>
                        </li>`
                }
            }
        }
    } else {
        for (const key in team2) {
            if (Object.prototype.hasOwnProperty.call(team2, key)) {
                const element = team2[key];
                let ele = document.getElementById(`${key}${teamNumber}`)
                if(element == false) return;
                if(ele) {
                    ele.innerHTML = `
                        <li>
                            <center>
                                <button onclick="assignToTeam('${key}',2)">
                                    Captain
                                </button>
                            </center>
                            <div>
                                <a href=${element.char.url}><img src="${element.img}"></a>
                            </div>
                            <center>
                            <p>${element.char.name}</p>
                            </center>
                        </li>`
                }
            }
        }
    }





}