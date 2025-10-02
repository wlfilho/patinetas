# Negócios com Falha na Geocodificação

## Resumo

**Data:** 2025-10-01  
**Total de negócios:** 40  
**Geocodificados com sucesso:** 16 (40%)  
**Falharam:** 24 (60%)

---

## Negócios que Falharam

Estes negócios não puderam ser geocodificados automaticamente. As coordenadas precisam ser adicionadas manualmente.

### Como Adicionar Coordenadas Manualmente:

1. **Encontre o endereço no Google Maps**
2. **Clique com botão direito no local exato**
3. **Selecione "O que há aqui?"**
4. **Copie as coordenadas** (formato: latitude, longitude)
5. **Execute o SQL abaixo** substituindo os valores

```sql
UPDATE diretorio_patinetas
SET gps_coordinates = '{"latitude": LATITUDE_AQUI, "longitude": LONGITUDE_AQUI}'::jsonb
WHERE id = ID_DO_NEGOCIO;
```

---

## Lista de Negócios

### 1. Emove Scooters & Bikes - Bogotá (ID: 9)
- **Endereço:** Calle 116 # 18B - 68
- **Cidade:** Bogotá
- **Departamento:** Bogotá D.C.
- **Motivo da falha:** Endereço não encontrado pela API
- **Sugestão:** Verificar se o endereço está correto

---

### 2. Emove Scooters & Bikes - Belaire Plaza (ID: 11)
- **Endereço:** Carrera 7 # 152-52, local 2-02
- **Cidade:** Bogotá
- **Departamento:** Bogotá D.C.
- **Motivo da falha:** Endereço não encontrado pela API
- **Sugestão:** Remover "local 2-02" e tentar apenas "Carrera 7 # 152-52"

---

### 3. Tu Patineta - Medellín (ID: 14)
- **Endereço:** Av Nutibára 72-105 (Transv 39B. Laureles)
- **Cidade:** Medellín
- **Departamento:** Antioquia
- **Motivo da falha:** Formato de endereço complexo
- **Sugestão:** Simplificar para "Avenida Nutibara 72-105, Laureles"

---

### 4. Scooters Co - Bogotá (ID: 16)
- **Endereço:** Carrera 63 #98B-30, Barrio Los Andes
- **Cidade:** Bogotá
- **Departamento:** Bogotá D.C.
- **Motivo da falha:** Endereço não encontrado pela API
- **Sugestão:** Verificar numeração (98B pode não existir)

---

### 5. Go Green - Calle 85 (ID: 17)
- **Endereço:** Cra. 15 #85-25 - Antigo Country
- **Cidade:** Bogotá
- **Departamento:** Bogotá D.C.
- **Motivo da falha:** "Antigo Country" não reconhecido
- **Sugestão:** Remover "Antigo Country"

---

### 6. Migo Bogotá (ID: 19)
- **Endereço:** Cra. 15 #85-31, Rincón del Chico
- **Cidade:** Bogotá
- **Departamento:** Bogotá D.C.
- **Motivo da falha:** Endereço não encontrado pela API
- **Sugestão:** Verificar se é "Carrera 15 #85-31"

---

### 7. Eagle Movinge (ID: 22)
- **Endereço:** Cra. 15 #8052, Uniremington
- **Cidade:** Bogotá
- **Departamento:** Bogotá D.C.
- **Motivo da falha:** Numeração incorreta (#8052 parece errado)
- **Sugestão:** Verificar se é "#80-52" ou "#85-52"

---

### 8. Patinetas Electricas Del eje (ID: 27)
- **Endereço:** Calle 20 #20-126, La Pradera
- **Cidade:** Pereira
- **Departamento:** Risaralda
- **Motivo da falha:** Endereço não encontrado pela API
- **Sugestão:** Verificar endereço completo

---

### 9. Scooter Planet (ID: 30)
- **Endereço:** Cl. 32C 80A 77 Local 172, Nueva Villa de Aburrá
- **Cidade:** Medellín
- **Departamento:** Antioquia
- **Motivo da falha:** Formato complexo com "Local 172"
- **Sugestão:** Remover "Local 172" e usar apenas "Calle 32C #80A-77"

---

### 10. E-Mobyl (ID: 31)
- **Endereço:** Cl 147 #19-50 Local 14, Usaquén
- **Cidade:** Bogotá
- **Departamento:** Bogotá D.C.
- **Motivo da falha:** "Local 14" pode estar causando problema
- **Sugestão:** Remover "Local 14"

---

### 11. ScooterOne Col (ID: 32)
- **Endereço:** Cl 63 #72 47, Normandia
- **Cidade:** Bogotá
- **Departamento:** Bogotá D.C.
- **Motivo da falha:** Falta hífen na numeração
- **Sugestão:** Corrigir para "Calle 63 #72-47"

---

### 12. Ozono eBikes Medellin (ID: 34)
- **Endereço:** Carrera 48, Av. Las Vegas #7-22
- **Cidade:** Medellín
- **Departamento:** Antioquia
- **Motivo da falha:** Formato confuso (duas vias)
- **Sugestão:** Usar apenas "Avenida Las Vegas #7-22"

---

### 13. Dualtron Medellin (ID: 38)
- **Endereço:** Cl. 23 Sur #42b - 65, Los Cristales
- **Cidade:** Envigado
- **Departamento:** Antioquia
- **Motivo da falha:** Endereço não encontrado pela API
- **Sugestão:** Verificar se é "Calle 23 Sur #42B-65"

---

### 14. EGOU - Medellín (ID: 41)
- **Endereço:** Cl 34 #43 66 Local 1134, La Candelaria
- **Cidade:** Medellín
- **Departamento:** Antioquia
- **Motivo da falha:** Falta hífen e "Local 1134"
- **Sugestão:** Corrigir para "Calle 34 #43-66"

---

### 15. Sky Motion - Medellín (ID: 42)
- **Endereço:** Cra. 48 #17a sur 47 Edificio Portugal, Local 101
- **Cidade:** Medellín
- **Departamento:** Antioquia
- **Motivo da falha:** Formato muito complexo
- **Sugestão:** Simplificar para "Carrera 48 #17A Sur-47"

---

### 16. Solugreen Mobility SAS (ID: 44)
- **Endereço:** Cra. 44 #82 159 Local 3, Nte. Centro Historico
- **Cidade:** Barranquilla
- **Departamento:** Atlántico
- **Motivo da falha:** Numeração incorreta
- **Sugestão:** Corrigir para "Carrera 44 #82-159"

---

### 17. Ecofly - Barranquilla (ID: 45)
- **Endereço:** Cra. 43 #69-19, Nte. Centro Historico
- **Cidade:** Barranquilla
- **Departamento:** Atlántico
- **Motivo da falha:** Endereço não encontrado pela API
- **Sugestão:** Verificar endereço

---

### 18. Segway Ninebot Colombia (ID: 46)
- **Endereço:** Kr 13 #92-57 oficina 208, Chapinero
- **Cidade:** Bogotá
- **Departamento:** Bogotá D.C.
- **Motivo da falha:** "oficina 208" pode estar causando problema
- **Sugestão:** Remover "oficina 208"

---

### 19. Kaabo Metrópolis (ID: 48)
- **Endereço:** Centro Comercial Metropolis, Av. 68 #75A-50, Metropolis
- **Cidade:** Bogotá
- **Departamento:** Bogotá D.C.
- **Motivo da falha:** Formato muito complexo
- **Sugestão:** Usar apenas "Avenida 68 #75A-50"

---

### 20. Maga Electric Technology (ID: 49)
- **Endereço:** Cra. 38 #10-90 local 10-71, Zona Industrial
- **Cidade:** Bogotá
- **Departamento:** Bogotá D.C.
- **Motivo da falha:** "local 10-71" confuso
- **Sugestão:** Remover "local 10-71"

---

### 21. URBAN ELECTRIC (ID: 51)
- **Endereço:** CRA 15 # 124 30, Centro Comercial Unicentro
- **Cidade:** Bogotá
- **Departamento:** Bogotá D.C.
- **Motivo da falha:** Falta hífen na numeração
- **Sugestão:** Corrigir para "Carrera 15 #124-30"

---

### 22. Segway Center (ID: 52)
- **Endereço:** Cra. 14 #81-19, La Cabrera
- **Cidade:** Bogotá
- **Departamento:** Bogotá D.C.
- **Motivo da falha:** Endereço não encontrado pela API
- **Sugestão:** Verificar endereço

---

### 23. EcoElectric Mobility (ID: 56)
- **Endereço:** Cra. 7 #18 - 38, Parque
- **Cidade:** Soacha
- **Departamento:** Cundinamarca
- **Motivo da falha:** Endereço não encontrado pela API
- **Sugestão:** Verificar se cidade é realmente Soacha

---

### 24. Naao Mobility (ID: 57)
- **Endereço:** Cl. 60 #9 – 83 Local 108, Centro Comercial Aquarium - Chapinero
- **Cidade:** Bogotá
- **Departamento:** Bogotá D.C.
- **Motivo da falha:** Formato muito complexo
- **Sugestão:** Simplificar para "Calle 60 #9-83"

---

## Padrões Comuns de Erros

### 1. **Locais/Oficinas**
Endereços com "Local X" ou "Oficina X" geralmente falham.
**Solução:** Remover essas informações extras.

### 2. **Numeração Incorreta**
Falta de hífen entre número e complemento (ex: "#82 159" ao invés de "#82-159").
**Solução:** Adicionar hífen correto.

### 3. **Informações Extras**
Nomes de centros comerciais, bairros específicos, etc.
**Solução:** Usar apenas via e numeração básica.

### 4. **Abreviações**
"Kr", "Cl", "Cra" podem não ser reconhecidas.
**Solução:** Usar nomes completos: "Carrera", "Calle".

---

## Script SQL para Correção em Lote

```sql
-- Exemplo: Corrigir múltiplos endereços de uma vez

-- Eagle Movinge (corrigir numeração)
UPDATE diretorio_patinetas
SET direccion = 'Cra. 15 #80-52, Uniremington'
WHERE id = 22;

-- ScooterOne Col (adicionar hífen)
UPDATE diretorio_patinetas
SET direccion = 'Cl 63 #72-47, Normandia'
WHERE id = 32;

-- URBAN ELECTRIC (adicionar hífen)
UPDATE diretorio_patinetas
SET direccion = 'CRA 15 #124-30, Centro Comercial Unicentro'
WHERE id = 51;

-- Após corrigir os endereços, rodar novamente:
-- npx tsx scripts/geocode-businesses.ts
```

---

## Próximos Passos

1. **Revisar endereços** dos 24 negócios que falharam
2. **Corrigir endereços** no banco de dados
3. **Rodar script novamente** para geocodificar os corrigidos
4. **Adicionar coordenadas manualmente** para os que continuarem falhando

---

**Nota:** Os 16 negócios que foram geocodificados com sucesso já estão funcionando perfeitamente no mapa! 🎉

