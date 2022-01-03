import axios from "axios";
import { teams } from "./teams"
//import { resultados } from "./test/resultados";

const render = document.getElementById('contenedor');
const btnReset = document.getElementById('btnResetId')

const rb1 = document.getElementById('btnradio1')

var resultados = '';

if (resultados === '') {
    const options = {
        method: 'GET',
        url: "https://api-nba-v1.p.rapidapi.com/games/league/standard/2021",
        // "https://api-nba-v1.p.rapidapi.com/teams/league/standard" ,  // <-De aqui viene la informacion

        headers: {
            'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
            'x-rapidapi-key': '31986239ecmshd8c56f69e867864p184161jsn65f7126aeb28'
        }
    };

    axios.request(options).then(function (response) {
        console.log('Asi es, se ha hecho una peticion');
        resultados = response.data.api.games;

    }).catch(function (error) {
        console.error(error);
    });
}else{
    console.log('consumo Regulado')
}
//
refresh();


btnReset.addEventListener('click', (event) => { 
    refresh();
})
    
function refresh(){
    render.innerHTML = ""
    const todosLosItems = [];
    
    //  url:"https://api-nba-v1.p.rapidapi.com/teams/league/standard",  // <-De aqui viene la informacion
    
    teams.forEach(element => {
    
       if( element.logo != "" &&  element.teamId != 3 && element.teamId != 12 && element.teamId != 13 && element.teamId != 18 && element.teamId !=32){
        
        // logotipos
        const imagen = document.createElement('img')
        imagen.src = element.logo
        imagen.setAttribute('id', element.teamId); 
        imagen.className = "img-fluid"
        imagen.style = "height: 70px; width: 70px"

        //Nombre 
        const titulo = document.createElement('p')
        titulo.textContent = element.fullName
        titulo.setAttribute = ('id', 'tituloId'),
        titulo.className = "text-center"      

        //Div Final
        const lista = document.createElement('div');
        lista.setAttribute('id', element.teamId); 
        lista.className = "divTouch pt-2 rounded "
    
        lista.append(imagen, titulo)  
     
        todosLosItems.push(lista)
       } 
    });
    render.append(...todosLosItems)

    var x = document.getElementsByClassName('divTouch');
    var y = 0;
    
    // Creacion de la tabla por JS!
    const t1 = document.createElement('table');
    t1.className = 'table table-hover p-2'

    const t2 = document.createElement('thead')
    t1.append(t2);

    const t3 = document.createElement('tr')
    t2.append(t3)

    const titulos = ['Equipo Local','','','Equipo Visita','Total de Puntos']

    for (let i = 0; i < titulos.length; i++) {
        const t4 = document.createElement('th');
        t4.textContent = titulos[i];
        t4.scope = 'row';
        t3.append(t4)
    }

    const table = document.createElement('tbody')

    todosLosItems.forEach(equipo => {

        x[y].addEventListener('click', (event) => {

            render.innerHTML = "";
            const todosLosResultados = [];
            
            let promedioLocal  = []
            let promedioVisita = []
            let promedioTotal  = []
            
            let isLocal = rb1.checked ? true : false;

        
            resultados.forEach(resultado => {

            if (resultado.statusGame == "Finished") {

                if ( (isLocal ? resultado.hTeam.teamId : resultado.vTeam.teamId) == equipo.id) {

                // Reglon
                const row = document.createElement("tr");
                row.className = isLocal ? parseInt(resultado.vTeam.score.points) > parseInt(resultado.hTeam.score.points) ? "table-danger": "table-success" :
                                          parseInt(resultado.hTeam.score.points) > parseInt(resultado.vTeam.score.points) ? "table-danger": "table-success" 

                // Nombre Equipo Local
                const colLocalName = document.createElement("td");
                colLocalName.textContent = resultado.hTeam.nickName ;
                row.append(colLocalName);

                // Puntos de Local
                const colLocalPoints = document.createElement("td");
                colLocalPoints.textContent = resultado.hTeam.score.points;
                row.append(colLocalPoints);

                // Puntos de Visita
                const colAwayName = document.createElement("td");
                colAwayName.textContent = resultado.vTeam.score.points ;
                row.append(colAwayName);

                // Nombre Equipo Visita
                const colAwayPoints = document.createElement("td");
                colAwayPoints.textContent = resultado.vTeam.nickName ;
                row.append(colAwayPoints);

                // Total de Puntos
                const colTotalPoints = document.createElement("td");
                colTotalPoints.textContent = parseInt(resultado.hTeam.score.points) + parseInt(resultado.vTeam.score.points);
                row.append(colTotalPoints);

                table.append(row);

                // Calculos Matematicos
                promedioLocal.push( parseInt(resultado.hTeam.score.points));

                promedioVisita.push(parseInt(resultado.vTeam.score.points));

                promedioTotal.push( parseInt(resultado.vTeam.score.points)  + parseInt(resultado.hTeam.score.points)

                );
              }
            }
            });

            t1.append(table);

            // RESULTADO FINALES

            // Renglon de promedio de Puntos
            const rowavg = document.createElement('tr');

            // Leyenda de Promedio 
            const colAvg = document.createElement('td');
            colAvg.textContent = 'Promedio';
            rowavg.append(colAvg);

            // Promedio de Puntos de Local 
            const colLocalAvg = document.createElement('td');
            colLocalAvg.textContent = (promedioLocal.reduce((previous, current) => current += previous)  / (promedioLocal.length )).toFixed(2)
            rowavg.append(colLocalAvg);

            // Promedio de Puntos de Visita 
            const colAwayAvg = document.createElement('td');
            colAwayAvg.textContent = (promedioVisita.reduce((previous, current) => current += previous)  / (promedioVisita.length )).toFixed(2)
            rowavg.append(colAwayAvg);

            // Leyenda de Vacia 
            const colEmpty = document.createElement('td');
            colEmpty.textContent = '';
            rowavg.append(colEmpty);

            // Promedio de los Equipos 
            const colTotalAvg = document.createElement('td');
            colTotalAvg.textContent = (promedioTotal.reduce((previous, current) => current += previous)  / (promedioTotal.length )).toFixed(2)
            rowavg.append(colTotalAvg);

            t1.append(rowavg) 

            render.append(...todosLosResultados)
            render.append(t1)
        });
        y++;
      
    });  
//});
}


// render.innerHTML += '<p>'+ resultado.hTeam.nickName + ' ' +  resultado.hTeam.score.points + ' - ' +  resultado.vTeam.nickName + ' ' +  resultado.vTeam.score.points + '</p>' 

const btnActualizar = document.getElementById('btnApi');
/*
btnActualizar.addEventListener('click', (event) => {
    const options = {
        method: 'GET',
        url: "https://api-nba-v1.p.rapidapi.com/games/league/standard/2021", 
        // "https://api-nba-v1.p.rapidapi.com/teams/league/standard" ,
        // "https://api-nba-v1.p.rapidapi.com/games/league/standard/2021",  // <-De aqui viene la informacion
        
        headers: {
          'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
          'x-rapidapi-key': '31986239ecmshd8c56f69e867864p184161jsn65f7126aeb28'
        }
      };
      
      axios.request(options).then(function (response) {
          console.log(response.data.api.games);
      }).catch(function (error) {
          console.error(error);
      });

})*/