const form = document.querySelector("form");
const t_apuesta = document.getElementById("texto_apuesta")
const t_resultado = document.getElementById("texto_resultado")
const t_monedas = document.getElementById("texto_monedas")


var monedas = global_config['monedas']
t_monedas.textContent = `Monedas: ${monedas}`



form.addEventListener(
    "submit",
    (event) => {
        const data = new FormData(form);
        const id_apuesta = `n_${data.get('apuesta')}`
        // document.getElementById(id_apuesta).checked = false
        
        tirarApuesta(data.get('apuesta'), data.get('multiplicador'))
        
        event.preventDefault();
    },
    false,
);



function crearRuleta() { // Probablemente esto se pueda hacer mas facil aprovechando un FlexBox, pero funciona
    const ceros = global_config.ceros
    const columnas = global_config.columnas
    const filas = global_config.filas_enteros + 1

    height = 100/(filas*1.1)
    
    if (ceros == 1) {
        crearBoton(0, '27%', '2%', '47%', height + '%')
    } else if (ceros == 2) {
        crearBoton(0, '2%', '2%', '47%', height + '%')
        crearBoton('00', '51%', '2%', '47%', height + '%')
    }
    
    width = (100 - 2*(columnas+1))/columnas
    for (i=0; i<columnas; i++) {
        for (j=1; j<filas; j++) {
            const numero = (j-1)*columnas + i + 1
            const color = global_config.colores[numero-1]
            crearBoton(numero, (i*width + 2*(i+1)) + '%', (j*height + 2) + '%',width + '%', height + '%', color)
        }
    }
}


function crearMultiplicadores() {
    height = 100/(global_config.multiplicadores.length*1.2)
    for (var [i, mult] of global_config.multiplicadores.entries()) {
        crearBoton(mult, '5%', (i*(height+1) + 1) + '%', '90%', height + '%', color='multiplicador', tipo='multiplicador')
    }
    $('#m_1').prop('checked', true)
}


function crearBoton(i, left, top, width, height, color='v', tipo='numero') {
    var input = document.createElement('input')
    input.type = 'radio'

    switch (tipo) {
        case 'numero':
            var input_id = 'n_'+i
            var padre = $('#ruleta')
            input.name = "apuesta"
            break
        case 'multiplicador':
            var input_id = 'm_'+i
            var padre = $('#multiplicadores')
            input.name = "multiplicador"
            break
    } 
    input.id = input_id
    input.value = i

    var label = document.createElement('label')
    label.classList.add("btn")
    label.classList.add(color)
    label.classList.add("flex-container") //Permite centrar bien el texto

    label.style.left = left
    label.style.top = top
    label.style.width = width
    label.style.height = height

    label.style.display = 'flex'
    label.style.alignItems = 'center'
    label.style.justifyContent = 'center'

    label.innerText = i
    label.style.fontSize = (parseFloat(height)/3.5) + 'vmin' // Revisar valores

    label.setAttribute('for', input_id)

    padre.append(input)
    padre.append(label)
}



function chequearMultiplicadoresValidos() {
    for (const mult of global_config['multiplicadores']) {
        const id_mult = `#m_${mult}`

        if (monedas >= mult) {
            $(id_mult).removeAttr('disabled')
        } else {
            $(id_mult).attr('disabled','disabled')
            $(id_mult).prop("checked", false)
        }
    }
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function tirarApuesta(apuesta, multiplicador) {
    monedas -= 1 * multiplicador
    t_monedas.textContent = `Monedas: ${monedas}`


    var resultado = getRandomInt(0,8)
    t_apuesta.textContent = `Apuesta: ${apuesta}`
    t_resultado.textContent = `Resultado: ${resultado}`

    if (apuesta == resultado){
        t_apuesta.style.color = "#006400"
        monedas += (global_config.columnas * global_config.filas_enteros) * multiplicador
        t_monedas.textContent = `Monedas: ${monedas}`
    }
    else {
        t_apuesta.style.color = "#640000"
    }

    chequearMultiplicadoresValidos()
}

function configuracionInicial() {
    $('#ruleta').height(global_config.tapete_altura)
    $('#ruleta').width(global_config.tapete_ancho)
    $('#multiplicadores').height(global_config.multiplicadores_altura)
    $('#multiplicadores').width(global_config.multiplicadores_ancho)

    crearRuleta()
    crearMultiplicadores()
    chequearMultiplicadoresValidos()
}

configuracionInicial()
