let contador = 0;
const botao = document.getElementById("btn");
const img = document.getElementById("imagem");
const contH = document.getElementById("contador");
const body = document.getElementById("body");
const central = document.getElementById("central");

const ctx = document.getElementById('grafico').getContext('2d');
let chart;

function ligarDesligar() {
    const ligando = botao.textContent === "Ligar LED";

    fetch('http://localhost:3000/led', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: ligando ? 1 : 0 })
    });

    botao.textContent = ligando ? "Desligar LED" : "Ligar LED";
    botao.style.backgroundColor = ligando ? "red" : "green";
    img.src = ligando ? "ligada.png" : "desligada.png";
    body.style.backgroundColor = ligando ? "white" : "black";
    central.style.display = ligando ? "block" : "none";

    if (ligando) {
        contador++;
        contH.textContent = `Ligado ${contador} vezes`;
        const timestamp = new Date().toISOString();

        fetch('http://localhost:3000/historico', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataHora: timestamp })
        });
    }
}

function atualizarGrafico(dados) {
    const pontos = dados.map(item => ({
        x: new Date(item.dataHora),
        y: 1
    })).sort((a, b) => a.x - b.x);

    if (chart) {
        chart.data.datasets[0].data = pontos;
        chart.update();
    } else {
        chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Horário em que o LED foi ligado',
                    data: pontos,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    pointRadius: 5,
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'minute',
                            tooltipFormat: 'HH:mm:ss',
                            displayFormats: {
                                minute: 'HH:mm:ss'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Horário'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Evento de Ligação'
                        },
                        ticks: {
                            callback: () => '',
                            stepSize: 1
                        },
                        min: 0,
                        max: 2
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const hora = new Date(context.raw.x).toLocaleTimeString();
                                return `Ligado às ${hora}`;
                            }
                        }
                    },
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

function init() {
    botao.textContent = "Ligar LED";
    botao.style.backgroundColor = "green";
    img.src = "desligada.png";
    body.style.backgroundColor = "black";
    central.style.display = "none";

    fetch('http://localhost:3000/historico')
        .then(res => res.json())
        .then(data => {
            contador = data.length;
            contH.textContent = `Ligado ${contador} vezes`;
            atualizarGrafico(data);
        });

    fetch('http://localhost:3000/led')
        .then(res => res.json())
        .then(data => {
            if (data.state === 1) {
                botao.textContent = "Desligar LED";
                botao.style.backgroundColor = "red";
                img.src = "ligada.png";
                body.style.backgroundColor = "white";
                central.style.display = "block";
            }
        });
}

window.onload = init;

// const firebaseConfig = {
//     apiKey: "AIzaSyAdHhHzspajzkLWGZk01-FzSHPj8-rgyB4",
//     authDomain: "esp32-3ce2b.firebaseapp.com",
//     databaseURL: "https://esp32-3ce2b-default-rtdb.firebaseio.com",
//     projectId: "esp32-3ce2b",
//     storageBucket: "esp32-3ce2b.firebasestorage.app",
//     messagingSenderId: "158560917927",
//     appId: "1:158560917927:web:ae18580988cc19a0807e82",
//     measurementId: "G-CWP97836MM"
// };

// firebase.initializeApp(firebaseConfig);
// const database = firebase.database();

// let contador = 0;
// const botao = document.getElementById("btn");
// const img = document.getElementById("imagem");
// const contH = document.getElementById("contador");
// const body = document.getElementById("body");
// const central = document.getElementById("central");

// const ctx = document.getElementById('grafico').getContext('2d');
// let chart;

// function ligarDesligar() {
//     if (botao.textContent === "Ligar LED") {

//         fetch('http://localhost:3000/led', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ state: 1 })
//         });

//         botao.textContent = "Desligar LED";
//         botao.style.backgroundColor = "red";
//         img.src = "ligada.png";
//         body.style.backgroundColor = "white";
//         central.style.display = "block";

//         contador++;
//         contH.textContent = `Ligado ${contador} vezes`;
//         const timestamp = new Date().toISOString();

//         fetch('http://localhost:3000/historico', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ dataHora: timestamp })
//         });

//     } else {

//         fetch('http://localhost:3000/led', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ state: 0 })
//         });

//         botao.textContent = "Ligar LED";
//         botao.style.backgroundColor = "green";
//         img.src = "desligada.png";
//         body.style.backgroundColor = "black";
//         central.style.display = "none";
//     }
// }

// function atualizarGrafico(dados) {
//     const pontos = dados.map(item => {
//         return {
//             x: new Date(item.dataHora),
//             y: 1
//         };
//     });

//     pontos.sort((a, b) => a.x - b.x);

//     if (chart) {
//         chart.data.datasets[0].data = pontos;
//         chart.update();
//     } else {
//         chart = new Chart(ctx, {
//             type: 'scatter',
//             data: {
//                 datasets: [{
//                     label: 'Horário em que o LED foi ligado',
//                     data: pontos,
//                     backgroundColor: 'rgba(75, 192, 192, 0.6)',
//                     borderColor: 'rgba(75, 192, 192, 1)',
//                     pointRadius: 5,
//                 }]
//             },
//             options: {
//                 scales: {
//                     x: {
//                         type: 'time',
//                         time: {
//                             unit: 'minute',
//                             tooltipFormat: 'HH:mm:ss',
//                             displayFormats: {
//                                 minute: 'HH:mm:ss'
//                             }
//                         },
//                         title: {
//                             display: true,
//                             text: 'Horário'
//                         }
//                     },
//                     y: {
//                         title: {
//                             display: true,
//                             text: 'Evento de Ligação'
//                         },
//                         ticks: {
//                             callback: () => '',
//                             stepSize: 1
//                         },
//                         min: 0,
//                         max: 2
//                     }
//                 },
//                 plugins: {
//                     tooltip: {
//                         callbacks: {
//                             label: (context) => {
//                                 const hora = new Date(context.raw.x).toLocaleTimeString();
//                                 return `Ligado às ${hora}`;
//                             }
//                         }
//                     },
//                     legend: {
//                         display: false
//                     }
//                 }
//             }
//         });
//     }
// }

// fetch('http://localhost:3000/historico')
//     .then(res => res.json())
//     .then(data => {
//         const dados = [];
//         const snapshot = data.val();
//         snapshot.forEach(element => {
//             dados.push(element.val());
//         });
//         atualizarGrafico(dados);
//     });

// // database.ref("historico").on("value", snapshot => {
// //     const dados = [];
// //     snapshot.forEach(child => {
// //         dados.push(child.val());
// //     });
// //     atualizarGrafico(dados);
// // });

// function init() {
//     botao.textContent = "Ligar LED";
//     botao.style.backgroundColor = "green";
//     img.src = "desligada.png";
//     body.style.backgroundColor = "black";
//     central.style.display = "none";

//     fetch('http://localhost:3000/historico')
//         .then(res => res.json())
//         .then(data => {
//             contador = data.length;
//             contH.textContent = `Ligado ${contador} vezes`;
//             atualizarGrafico(data);
//         });

//     // database.ref("historico").once("value", snapshot => {
//     //     contador = snapshot.numChildren();
//     //     contH.textContent = `Ligado ${contador} vezes`;
//     // });

//     fetch('http://localhost:3000/historico')
//         .then(res => res.json())
//         .then(data => {
//             if (data.state === 1) {
//                 botao.textContent = "Desligar LED";
//                 botao.style.backgroundColor = "red";
//                 img.src = "ligada.png";
//                 body.style.backgroundColor = "white";
//                 central.style.display = "block";
//             }
//         })

//     // database.ref("led/state").once("value").then(snapshot => {
//     //     const estado = snapshot.val();
//     //     if (estado === 1) {
//     //         botao.textContent = "Desligar LED";
//     //         botao.style.backgroundColor = "red";
//     //         img.src = "ligada.png";
//     //         body.style.backgroundColor = "white";
//     //         central.style.display = "block";
//     //     }
//     // });
// }

// window.onload = init;