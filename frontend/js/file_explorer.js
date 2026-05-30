import apiservice from "./api_service.js"


const icones = {
    py: '../assets/icons8-serpente-48.png',
    js: '../assets/icons8-javascript-24.png',
    css: '../assets/icons8-css-48.png',
    java: '../assets/icons8-logo-java-coffee-cup-48.png',
    txt: '../assets/icons8-logo-txt-50.png',
    JSON: './assets/icons8-logo-json-50.png',
    md: './assets/icons8-circled-i-48.png'
}

function pegarIcone(caminho){
    const extensao = caminho.split('.').pop();

    return icones[extensao]
}


export class FileExplorer{


    
    
    async static list(){
      
        const array = await apiservice.get(endpoint)


        const container = document.getElementById('container')

    
        array.array.forEach(element => {
        
            const file = document.createElement('div')

            file.classList.add('card')

            const titulo = document.createElement('h2')

            const img = document.createElement('img')

            titulo.TextContent = element.text;

            img.src = pegarIcone(titulo)

            file.appendChild(img)
            file.appendChild(titulo)

            container.appendChild(file)
        });

    }

}