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

let team1tracker = []
let team2tracker = []

let pickedCharacter = 0
let lastTeamLength = 0



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
    Array.from(document.getElementById("currentCharacter").children).forEach(element => {
        element.remove()
    });
    document.getElementById(`player${currentTeam}`).style.backgroundColor = "white";
    currentCharacter = null;
    currentTeam = 0;
    lastTeamLength = 0;
    team1tracker = [];
    team2tracker = [];
    for (const key in team1) {
        if (Object.prototype.hasOwnProperty.call(team1, key)) {
            const element = team1[key];
            let ele = document.getElementById(`${key}1`)
            if(ele) {
                ele.innerHTML = `
                    <li>
                        <center>
                            <button onclick="assignToTeam('${key}',1)">
                                ${key}
                            </button>
                        </center>
                        <div>
                            <a href=''><img src="https://placehold.co/300x300.png"></a>
                        </div>
                        <center>
                        <p></p>
                        </center>
                    </li>`
            }
        }
    }
    for (const key in team2) {
        if (Object.prototype.hasOwnProperty.call(team2, key)) {
            const element = team2[key];
            let ele = document.getElementById(`${key}2`)
            if(ele) {
                ele.innerHTML = `
                    <li>
                        <center>
                            <button onclick="assignToTeam('${key}',2)">
                                ${key}
                            </button>
                        </center>
                        <div>
                            <a href=''><img src="https://placehold.co/300x300.png"></a>
                        </div>
                        <center>
                        <p></p>
                        </center>
                    </li>`
            }
        }
    }

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
                    let start = page.thumbnail.source.indexOf("/revision")
                    let newLink = page.thumbnail.source.slice(0, start)
                    
                    return newLink;
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
    } else if(!doNotSwap) {
        if(currentTeam == 1) {
            if(lastTeamLength==team1tracker.length) return;
        } else {
            if(lastTeamLength==team2tracker.length) return;
        }
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
        let div = document.getElementById(`player${currentTeam}`);
        div.style.backgroundColor = "white";
        currentTeam = currentTeam === 1 ? 2 : 1;
    }
    if (currentTeam == 1) {
        lastTeamLength = team1tracker.length
    } else {
        lastTeamLength = team2tracker.length
    }
    document.getElementById(`player${currentTeam}`).style.backgroundColor = "yellow";
}


async function pickCharacter(theChar) {
    let char = allCharacter[theChar]
    let img = await getImage(char.url);
    if(currentCharacter) {
        let c = currentCharacter.char
        let i  = currentCharacter.img
        allCharacter[currentCharacter.index] = {c,i}
    } else {
        allCharacter.splice(theChar)
    }
    currentCharacter = {char, img, theChar}
}

function assignToTeam(position, teamNumber) {
    if(currentCharacter == false || currentCharacter == null) return;
    if(currentTeam != teamNumber) return;
    if(teamNumber == 1) {
        if(team1[position] != false) return;
        team1[position] = currentCharacter;
        team1tracker.push(currentCharacter)
        updateTeamDisplay(1);

    } else {
        if(team2[position] != false) return;
        team2[position] = currentCharacter;
        team2tracker.push(currentCharacter)
        updateTeamDisplay(2);
    }
    currentCharacter = null;
    rollCharacter();
}








function updateTeamDisplay(teamNumber) {
    if(teamNumber == 1) {
        for (const key in team1) {
            if (Object.prototype.hasOwnProperty.call(team1, key)) {
                const element = team1[key];
                let ele = document.getElementById(`${key}1`)
                if(element == false) continue;
                if(ele && element) {
                    ele.innerHTML = `
                        <li>
                            <center>
                                <button onclick="assignToTeam('${key}',1)">
                                    ${key}
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
                let ele = document.getElementById(`${key}2`)
                if(element == false) continue;
                if(ele && element) {
                    ele.innerHTML = `
                        <li>
                            <center>
                                <button onclick="assignToTeam('${key}',2)">
                                    ${key}
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