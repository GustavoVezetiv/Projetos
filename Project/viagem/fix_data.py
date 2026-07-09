import json
import os

# 1. GRAMADO
with open(r'c:\Users\gusta\Downloads\viagem\dados-passeios-com-imagens.json', 'r', encoding='utf-8', errors='ignore') as f:
    gramado_data = json.load(f)

for item in gramado_data:
    name = (item.get('name') or '').lower()
    city = (item.get('city') or '').lower()
    cat = ' '.join(item.get('category', [])).lower()
    
    # Pre-fill custom fields
    item['worthBuyingOnline'] = False
    item['tips'] = ""
    
    if name == 'lago negro / pedalinho':
        item['plannedDate'] = '19/07'
        item['plannedTime'] = '15:30' # Just an estimate based on day 1
    elif 'rua coberta' in name or 'igreja' in name:
        item['plannedDate'] = '19/07'
        item['plannedTime'] = '16:30'
    elif name == 'mini mundo':
        item['plannedDate'] = '20/07'
        item['plannedTime'] = '15:30'
        item['worthBuyingOnline'] = True
        item['tips'] = "O ingresso antecipado sai mais barato (R$86 no site vs R$96 na bilheteria)."
    elif name == 'restaurante quintanilha buffet':
        item['plannedDate'] = '20/07'
        item['plannedTime'] = '19:30'
        item['tips'] = "Ideal usar o Prime Gourmet: compra um, ganha outro."
    elif 'guarita' in name or 'furnas' in name:
        item['plannedDate'] = '21/07'
        item['plannedTime'] = '09:30'
        item['tips'] = "Se chover forte, encurtar o passeio."
    elif 'farol' in name or 'praia da cal' in name:
        item['plannedDate'] = '21/07'
        item['plannedTime'] = '12:10'
    elif 'orla' in name or 'gasômetro' in name or 'embarcadero' in name or 'pontal' in name:
        item['plannedDate'] = '21/07'
        item['plannedTime'] = '17:00'
    elif name == 'skyglass canela':
        item['plannedDate'] = '22/07'
        item['plannedTime'] = '09:30'
        item['worthBuyingOnline'] = True
        item['tips'] = "Comprar antes ajuda com o preço e a evitar filas. Verifique o clima antes."
    elif name == 'parque do caracol':
        item['plannedDate'] = '22/07'
        item['plannedTime'] = '11:45'
    elif 'catedral' in name:
        item['plannedDate'] = '22/07'
        item['plannedTime'] = '15:15'
    elif 'jolimont' in name or 'alpen' in name:
        item['plannedDate'] = '22/07'
        item['plannedTime'] = '16:20'
        if 'jolimont' in name:
            item['worthBuyingOnline'] = True
            item['tips'] = "R$149 online, mas R$189 no local. Vale comprar online."
    elif 'hector' in name:
        item['plannedDate'] = '22/07'
        item['plannedTime'] = '19:30'
    elif 'templo budista' in name:
        item['plannedDate'] = '23/07'
        item['plannedTime'] = '09:30'
    elif 'snowland' in name:
        item['worthBuyingOnline'] = True
        item['tips'] = "Comprar ingressos antecipadamente no site é mais barato."
        
    # Global tips
    if item.get('prime_gourmet') == 'sim' or item.get('prime_gourmet') == 'provável':
        item['tips'] += " A Fabi destaca que usar o Prime Gourmet é a principal ferramenta de economia aqui."

with open(r'c:\Users\gusta\Downloads\viagem\roteiros-viagem\trips\gramado\data.js', 'w', encoding='utf-8') as f:
    f.write('window.TRIP_DATA = ')
    json.dump(gramado_data, f, ensure_ascii=False, indent=2)
    f.write(';')


# 2. BARRA DO GARÇAS
with open(r'c:\Users\gusta\Downloads\viagem\barra\viagem_barra\viagem_barra\dados-passeios.json', 'r', encoding='utf-8', errors='ignore') as f:
    barra_data = json.load(f)

for item in barra_data:
    name = (item.get('nome') or '').lower()
    cat = ' '.join(item.get('categoria', [])).lower()
    
    item['worthBuyingOnline'] = False
    item['tips'] = item.get('observacoes', '')
    
    if 'serra azul' in name or 'mirante' in name or 'cristo' in name:
        item['plannedDate'] = '11/07'
    elif 'cachoeira' in cat and not ('distante' in name or 'cânion' in name or 'canion' in name):
        item['plannedDate'] = '12/07'
    elif 'cânion' in cat or 'canion' in cat or 'trilha' in cat or 'aventura' in cat:
        item['plannedDate'] = '13/07'
    elif 'rafting' in cat or 'rio' in cat or 'banho' in cat:
        item['plannedDate'] = '14/07'

with open(r'c:\Users\gusta\Downloads\viagem\roteiros-viagem\trips\barra\data.js', 'w', encoding='utf-8') as f:
    f.write('window.TRIP_DATA = ')
    json.dump(barra_data, f, ensure_ascii=False, indent=2)
    f.write(';')

print("Done generating utf-8 data files.")
