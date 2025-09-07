var fondoActual = null;
var capas = {
    'protegidas': null,
    'municipios': null
};
var seleccionado = null;

var geojsonData = {
    'protegidas': __PROTEGIDAS_JSON__,
    'municipios': __MUNICIPIOS_JSON__
};

function cambiarFondo(opcion) {
    if (fondoActual) {
        __MAP_ID__.removeLayer(fondoActual);
    }

    switch(opcion) {
        case 'osm':
            fondoActual = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
            break;
        case 'positron':
            fondoActual = L.tileLayer('https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png');
            break;
        case 'dark':
            fondoActual = L.tileLayer('https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png');
            break;
        case 'satellite':
            fondoActual = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
            break;
        case 'none':
            fondoActual = L.tileLayer('', { attribution: '' });
            break;
    }

    if (fondoActual) {
        fondoActual.addTo(__MAP_ID__);
    }
}

function mostrarCapa(nombre) {
    for (var key in capas) {
        if (capas[key]) {
            __MAP_ID__.removeLayer(capas[key]);
        }
    }

    if (!nombre) return;

    capas[nombre] = L.geoJson(geojsonData[nombre], {
        style: function(feature) {
            return {
                color: nombre === 'protegidas' ? 'green' : 'green',
                weight: 0.8,
                fillOpacity: 0.4
            };
        },
        onEachFeature: function (feature, layer) {
            var popupContent = "";

            if (nombre === 'protegidas' && feature.properties.Nombre) {
                popupContent += "<strong>" + feature.properties.Nombre + "</strong><br>";
            }

            if (nombre === 'municipios' && feature.properties.MUNICIPIO) {
                popupContent += "<strong>" + feature.properties.MUNICIPIO + "</strong><br>";
            }

            if (feature.properties.actividade) {
                var actividades = feature.properties.actividade.split('/');
                popupContent += "<ul style='padding-left: 20px; margin: 5px 0;'>";
                actividades.forEach(function(act) {
                    popupContent += "<li>" + act.trim() + "</li>";
                });
                popupContent += "</ul>";
            }

            layer.bindPopup("<div style='padding:5px; font-size:14px; font-family:Segoe UI'>" + popupContent + "</div>");
                        // Selección visual del área
            layer.on('click', function () {
                    if (seleccionado) {
                        // Restaurar estilo anterior del seleccionado
                        seleccionado.setStyle({
                            color: nombre === 'protegidas' ? 'green' : 'green',
                            weight: 0.8,
                            fillOpacity: 0.4
                        });
                    }

                    // Aplicar estilo destacado al actual
                    layer.setStyle({
                        color: '#ffc300',
                        weight: 0.8,
                        fillOpacity: 0.4
                    });

                    seleccionado = layer;
                });
        }
        
    }).addTo(__MAP_ID__);
}
