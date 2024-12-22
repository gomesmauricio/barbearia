// Carrossel
const track = document.getElementById('carousel-track');
const images = track.children;
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
let index = 0;

function updateCarousel() {
    track.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide() {
    index = (index + 1) % images.length;
    updateCarousel();
}

function prevSlide() {
    index = (index - 1 + images.length) % images.length;
    updateCarousel();
}

prevButton.addEventListener('click', prevSlide);
nextButton.addEventListener('click', nextSlide);
setInterval(nextSlide, 3000); // Avançar automaticamente a cada 3 segundos

document.addEventListener('DOMContentLoaded', () => {
    carregarProcedimentos();
});

//Carrega procedimentos
function carregarProcedimentos() {
    fetch('https://script.google.com/macros/s/AKfycby_n5pT54ZWsmSa36dL1JE2ATx8u44lNbhOKdnUbxWIyCBBROi5b0lTBD4uYDd93OMHiA/exec?procedimentos=all')
        .then(response => response.json())
        .then(procedimentos => {
            const selectProcedimentos = document.getElementById('select-procedimentos');
            selectProcedimentos.innerHTML = '<option>Selecione um procedimento</option>';
            procedimentos.forEach(proc => {
                const option = document.createElement('option');
                option.value = proc;
                option.textContent = proc;
                selectProcedimentos.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar procedimentos:', error));
}

// Agendamento - Integração com Planilha do Google
document.addEventListener("DOMContentLoaded", async () => {
    const sheetUrl = "https://script.google.com/macros/s/AKfycbw9E96rJvw9Lkxciurfr6E_ZdSRvKWeVya62Eia0y_I1_eQ4xCKyRgvPF9q9XiUKAmdHg/exec"; // Substitua pelo URL do seu script
    const diaSelect = document.getElementById("dia-select");
    const horarioSelect = document.getElementById("hora");
    const confirmarBtn = document.getElementById("confirmar-btn");

    // Carrega os dias disponíveis ao iniciar
    async function carregarDias() {
        try {
            const response = await fetch(`${sheetUrl}?dias=all`); // Ajuste o endpoint para retornar todos os dias
            const dias = await response.json();

            diaSelect.innerHTML = '<option value="" disabled selected>Selecione um dia</option>';
            dias.forEach(dia => {
                const option = document.createElement("option");
                option.value = dia;
                option.textContent = dia;
                diaSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Erro ao carregar dias:", error);
            alert("Erro ao carregar dias disponíveis.");
        }
    }

    // Atualiza os horários ao clicar no select de horários
    horarioSelect.addEventListener("focus", async () => {
        const dia = diaSelect.value;
        if (!dia) {
            alert("Por favor, selecione um dia antes de escolher o horário.");
            return;
        }

        try {
            const response = await fetch(`${sheetUrl}?dia=${dia}`);
            const horarios = await response.json();

            horarioSelect.innerHTML = '<option value="" disabled selected>Selecione um horário</option>';
            if (horarios.length === 0) {
                const option = document.createElement("option");
                option.textContent = "Nenhum horário disponível";
                option.disabled = true;
                horarioSelect.appendChild(option);
            } else {
                horarios.forEach(horario => {
                    const option = document.createElement("option");
                    option.value = horario;
                    option.textContent = horario;
                    horarioSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error("Erro ao buscar horários:", error);
            alert("Erro ao carregar horários.");
        }
    });

    //Salva agendamento
    async function agendarHorario(nome, procedimento, dia, hora, email, whatzapp) {
        const url = "https://script.google.com/macros/s/AKfycbwKddoGf1JgJSGz8N4VZ7cbgC_X30qcyK-dMnpoho8DtCvv1Ia7cNBqGzTgzLb7jbRiMQ/exec"; // Substitua "SEU_SCRIPT_URL" pela URL do seu script publicado

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    nome: nome,
                    procedimento: procedimento,
                    dia: dia,
                    hora: hora,
                    email: email,
                    whatzapp: whatzapp
                })
            });

            if (!response.ok) {
                throw new Error("Erro na requisição: " + response.status);
            }

            const result = await response.text();
            alert(result); // Exibe a resposta no navegador

        } catch (error) {
            console.error("Erro ao salvar agendamento:", error);
            alert("Erro ao salvar agendamento. Verifique os dados e tente novamente.");
        }
    }

    document.getElementById("agendamento-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const nome = document.getElementById("nome").value;
        const procedimento = document.getElementById("select-procedimentos").value;
        const dia = document.getElementById("dia-select").value;
        const hora = document.getElementById("hora").value;
        const email = document.getElementById("email").value;
        const whatzapp = document.getElementById("whatzapp").value;

        if (!nome || !procedimento || !dia || !hora || !email || !whatzapp) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        agendarHorario(nome, procedimento, dia, hora, email, whatzapp);
    });


    // Remove o horário escolhido
    async function removerHorario(dia, hora) {
        const url = "https://script.google.com/macros/s/AKfycby-bDsetcqx9dVLWOkxeMX-fnsgDhKf0N6wIQ2m8aPMod2sSOqQiDFs5MlkYsu4LQMExg/exec"; // Substitua "SEU_SCRIPT_URL" pela URL do seu script publicado

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    dia: dia,
                    hora: hora
                })
            });

            if (!response.ok) {
                throw new Error("Erro na requisição: " + response.status);
            }

            const result = await response.text();
            alert(result); // Exibe a resposta no navegador
            document.getElementById("agendamento-form").reset();
        } catch (error) {
            console.error("Erro ao remover horário:", error);
            alert("Erro ao remover horário. Verifique os dados e tente novamente.");
        }
    }

    // Função para capturar os dados do formulário e chamar a função acima
    document.getElementById("agendamento-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const dia = document.getElementById("dia-select").value;
        const hora = document.getElementById("hora").value;

        if (!dia || !hora) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        removerHorario(dia, hora);
    });

    // Inicializar
    await carregarProcedimentos();
    await carregarDias();
});