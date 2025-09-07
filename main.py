# main.py
import geopandas as gpd
import folium
import webview
from folium import Element
import os
# Leer shapefiles
areas_protegidas = gpd.read_file("datos_shp/areasprotegidas.gpkg").to_crs(epsg=4326)
municipios = gpd.read_file("datos_shp/municipios.gpkg").to_crs(epsg=4326)

# Centro del mapa
centro = areas_protegidas.geometry.union_all().centroid


# Crear mapa base
m = folium.Map(location=[centro.y, centro.x], zoom_start=7, control_scale=True)
map_id = m.get_name()

# GeoJSON en string
protegidas_geojson = areas_protegidas.to_json()
municipios_geojson = municipios.to_json()

# Cargar HTML externo para fondo
with open("fondo.html", "r", encoding="utf-8") as f:
    html_fondo = f.read()
m.get_root().html.add_child(Element(html_fondo))

# Cargar HTML externo para panel lateral
with open("panel.html", "r", encoding="utf-8") as f:
    html_panel = f.read()
m.get_root().html.add_child(Element(html_panel))

# Cargar script JS y reemplazar valores dinámicos
with open("script.js", "r", encoding="utf-8") as f:
    script_js = f.read()

script_js = script_js.replace("__MAP_ID__", map_id)
script_js = script_js.replace("__PROTEGIDAS_JSON__", protegidas_geojson)
script_js = script_js.replace("__MUNICIPIOS_JSON__", municipios_geojson)
m.get_root().html.add_child(Element(f"<script>{script_js}</script>"))

# Guardar HTML
html_file = "mapa.html"
m.save(html_file)

# Reemplazar recursos online por locales
with open(html_file, "r", encoding="utf-8") as f:
    html = f.read()
html = html.replace(
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'leaflet/leaflet.css'
).replace(
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'leaflet/leaflet.js'
)
with open(html_file, "w", encoding="utf-8") as f:
    f.write(html)

# Mostrar ventana con webview
ruta_absoluta = os.path.abspath(html_file)
webview.create_window("AREA DE TRABAJO NATIVA", f"file://{ruta_absoluta}")
webview.start()