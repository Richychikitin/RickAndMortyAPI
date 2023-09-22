const baseURL = 'https://rickandmortyapi.com/api/';

document.addEventListener('DOMContentLoaded', (e) => {
    document.getElementById('locationForm').addEventListener('submit', handleFormSubmit);
});

function handleFormSubmit(e) {
    e.preventDefault()
    const locationName = document.getElementById('location').value;
    fetchLocation(locationName);
}

async function fetchLocation(locationName) {
    try {
        const locationResponse = await fetch(`${baseURL}location/?name=${locationName}`);
        if (!locationResponse.ok) {
            throw new Error('Ubicación no encontrada');
        }
        const locationData = await locationResponse.json();
        const location = locationData.results[0];

        // Cambiar el color de fondo según el id de la ubicación
        const locationId = location.id;
        changeBackgroundColor(locationId);

        const residents = location.residents.slice(0, 5);
        const characterPromises = residents.map(fetchCharacterInfo);

        Promise.all(characterPromises)
            .then(characters => {
                const sortedCharacters = characters.sort((a, b) => a.name.localeCompare(b.name));
                displayCharacters(sortedCharacters);
                const elementos = document.querySelectorAll('.character');
  
                elementos.forEach(element => {
                    setHoverEventIn(element)
                });
                
            })
            .catch(error => {
                console.error(error);
            });
        
    } catch (error) {
        console.error(error);
    }
}

function setHoverEventIn(element) {
    element.addEventListener('mouseover', () => {     
        const name = element.dataset.name
        const status = element.dataset.status
        const especies = element.dataset.species
        const slice = element.dataset.episode.split(',')
        const origin = element.dataset.origin 

        const modal = document.querySelector('#modal')

        modal.querySelector('#title').textContent = name
        modal.querySelector('#status').textContent = status
        modal.querySelector('#species').textContent = especies
        modal.querySelector('#origin').textContent = origin
        
        modal.style.display = 'block'
        modal.classList.add('show')

        let linksContainer = modal.querySelector('#slice');
        linksContainer.innerHTML = ''

        slice.forEach(link => {
            console.log(slice.length);
            const modal = document.querySelector('#modal')
            let linkTag = document.createElement('p')
           

            linkTag.textContent = link

            linksContainer.innerHTML += linkTag.outerHTML
        });

        modal.querySelector('.btn-close').addEventListener('click', () => {
            modal.classList.remove('show')
            modal.classList.remove('fade')
            modal.style.display = ''
        });
    });
}

async function fetchCharacterInfo(residentURL) {
    try {
        const characterResponse = await fetch(residentURL);
        if (!characterResponse.ok) {
            throw new Error('Personaje no encontrado');
        }
        const characterData = await characterResponse.json();
        return {
            name: characterData.name,
            status: characterData.status,
            species: characterData.species,
            origin: characterData.origin.name,
            image: characterData.image,
            episodes: characterData.episode.slice(0, 3)
        };
    } catch (error) {
        console.error(error);
    }
}

function changeBackgroundColor(locationId) {
    const body = document.body;
    if (locationId < 50) {
        body.style.backgroundColor = 'green';
    } else if (locationId >= 50 && locationId < 80) {
        body.style.backgroundColor = 'blue';
    } else {
        body.style.backgroundColor = 'red';
    }
}

function displayCharacters(characters) {
    const characterList = document.getElementById('characterList');
    characterList.innerHTML = '';

    characters.forEach(character => {
        const characterDiv = document.createElement('div');
        characterDiv.classList.add('character');
        

        // characterDiv.style.height = '20rem'
        characterDiv.style.width = '20rem'
        characterDiv.style.marginTop = '4rem'
        characterDiv.style.padding = '2px 16px'
        characterDiv.style.boxShadow = '0 4px 8px 0 rgba(0,0,0,0.2)'
        characterDiv.style.transition = '0.3s'

        characterDiv.dataset.name = character.name
        characterDiv.dataset.status = character.status
        characterDiv.dataset.species = character.species
        characterDiv.dataset.origin = character.origin
        characterDiv.dataset.episode = character.episodes

        const characterImage = document.createElement('img');
        characterImage.src = character.image;
        characterImage.alt = character.name;
        characterImage.classList.add('character-image');


        const characterName = document.createElement('p');
        characterName.textContent = character.name;

        characterDiv.appendChild(characterImage);
        characterDiv.appendChild(characterName);

        characterList.appendChild(characterDiv);
    });
}
