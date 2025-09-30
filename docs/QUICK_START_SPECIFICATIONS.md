# Guia Rápido - Sistema de Especificações Técnicas

## 🚀 Início Rápido

### Para Administradores

#### Adicionar Especificações a um Novo Modelo

1. **Acesse o painel admin:**
   ```
   https://patinetaelectrica.com.co/admin/models/new
   ```

2. **Preencha informações básicas:**
   - Aba "Información Básica"
   - Marca, Nome, Descrição, Imagem
   - Especificações básicas (velocidade, autonomia, peso, potência, tempo de carga)
   - Preços

3. **Adicione especificações técnicas detalhadas:**
   - Clique na aba "Ficha Técnica" 🔧
   - Navegue pelas sub-abas:
     - 🔋 Bateria
     - ⚡ Motor
     - 🚀 Rendimiento
     - 📏 Dimensiones
     - 🛞 Neumáticos
     - 🛑 Frenos
     - 🔧 Suspensión
     - 🔒 Seguridad
     - 📱 Display
     - 📡 Conectividad
     - 🎮 Modos
     - ✨ Adicionales
     - 📦 Otros

4. **Preencha os campos disponíveis:**
   - ✅ Todos os campos são opcionais
   - ✅ Preencha apenas o que você tem informação
   - ✅ Use os placeholders como guia

5. **Configure SEO (opcional):**
   - Aba "SEO y Redes Sociales"

6. **Salve o modelo:**
   - Clique em "Crear Modelo"

#### Editar Especificações de um Modelo Existente

1. **Acesse a lista de modelos:**
   ```
   https://patinetaelectrica.com.co/admin/models
   ```

2. **Clique no ícone de editar** (✏️) do modelo desejado

3. **Navegue até a aba "Ficha Técnica"**

4. **Atualize as especificações** conforme necessário

5. **Salve as alterações**

### Para Desenvolvedores

#### Estrutura de Dados

```typescript
import { EspecificacionesTecnicas } from '@/types/especificaciones'

// Exemplo de especificações completas
const specs: EspecificacionesTecnicas = {
  bateria: {
    voltaje: "48V",
    capacidad: "15Ah",
    capacidad_wh: 720,
    tipo: "Litio",
    removible: true,
    tiempo_carga: "4-6 horas"
  },
  motor: {
    potencia: 500,
    potencia_pico: 800,
    tipo: "Brushless",
    ubicacion: "Rueda trasera",
    traccion: "Trasera"
  },
  rendimiento: {
    velocidad_maxima: 25,
    autonomia: 45,
    carga_maxima: 120,
    grado_subida: 20
  },
  // ... outras categorias
}
```

#### Usar no Código

```typescript
// Importar tipos
import { EspecificacionesTecnicas, createEmptyEspecificaciones } from '@/types/especificaciones'

// Criar especificações vazias
const emptySpecs = createEmptyEspecificaciones()

// Acessar especificações de um modelo
const model: ModeloPatineta = await modelService.getById(id)
const specs = model.especificaciones

// Verificar se tem bateria removível
if (specs?.bateria?.removible) {
  console.log('Bateria removível!')
}

// Exibir resistência à água
const waterResistance = specs?.seguridad?.resistencia_agua || 'Não especificado'
```

#### Componentes Disponíveis

**Admin:**
```tsx
import ModelSpecificationsManager from '@/components/admin/ModelSpecificationsManager'

<ModelSpecificationsManager
  initialData={especificaciones}
  onChange={(newSpecs) => setEspecificaciones(newSpecs)}
/>
```

**Público:**
```tsx
import TechnicalSpecifications from '@/components/catalog/TechnicalSpecifications'

<TechnicalSpecifications
  specifications={model.especificaciones}
  velocidad_maxima={model.velocidad_maxima}
  autonomia={model.autonomia}
  peso={model.peso}
  potencia={model.potencia}
  tiempo_carga={model.tiempo_carga}
/>
```

## 📋 Exemplos de Dados

### Exemplo 1: Modelo Básico (Xiaomi Mi Essential)

```json
{
  "bateria": {
    "voltaje": "36V",
    "capacidad": "5.1Ah",
    "tipo": "Litio"
  },
  "motor": {
    "potencia": 250,
    "tipo": "Brushless"
  },
  "rendimiento": {
    "velocidad_maxima": 20,
    "autonomia": 20,
    "carga_maxima": 100
  },
  "neumaticos": {
    "tamano_delantero": "8.5 pulgadas",
    "tipo": "Neumáticos"
  },
  "frenos": {
    "sistema": "Disco trasero"
  },
  "seguridad": {
    "resistencia_agua": "IPX4",
    "luces_delanteras": "LED",
    "luces_traseras": "LED roja"
  },
  "caracteristicas_adicionales": {
    "plegable": true,
    "tiempo_plegado": "3 segundos"
  }
}
```

### Exemplo 2: Modelo Avançado (Segway Ninebot Max G30)

```json
{
  "bateria": {
    "voltaje": "36V",
    "capacidad": "15Ah",
    "capacidad_wh": 551,
    "tipo": "Li-ion",
    "removible": false,
    "tiempo_carga": "6 horas"
  },
  "motor": {
    "potencia": 350,
    "potencia_pico": 700,
    "tipo": "Brushless Hub Motor",
    "ubicacion": "Rueda trasera"
  },
  "rendimiento": {
    "velocidad_maxima": 25,
    "autonomia": 65,
    "carga_maxima": 100,
    "grado_subida": 20,
    "grado_subida_porcentaje": 20
  },
  "dimensiones": {
    "dimensiones_desplegada": "116 x 47 x 120 cm",
    "dimensiones_plegada": "116 x 47 x 53 cm",
    "peso": 18.7
  },
  "neumaticos": {
    "tamano_delantero": "10 pulgadas",
    "tamano_trasero": "10 pulgadas",
    "tipo": "Tubeless",
    "presion": "50 PSI"
  },
  "frenos": {
    "tipo_delantero": "E-ABS",
    "tipo_trasero": "Disco",
    "sistema": "Sistema dual regenerativo"
  },
  "suspension": {
    "delantera": "Neumática",
    "trasera": "Neumática",
    "tipo": "Delantera y trasera"
  },
  "seguridad": {
    "resistencia_agua": "IPX5",
    "certificaciones": ["CE", "FCC", "RoHS"],
    "luces_delanteras": "LED 2.5W",
    "luces_traseras": "LED con freno",
    "reflectores": true,
    "bocina": true
  },
  "display": {
    "tipo": "LED",
    "informacion": ["Velocidad", "Batería", "Modo", "Bluetooth"]
  },
  "conectividad": {
    "app": "Segway-Ninebot",
    "bluetooth": true,
    "puerto_carga": "DC"
  },
  "modos_conduccion": {
    "modos": ["Eco", "Standard", "Sport"],
    "cruise_control": true
  },
  "caracteristicas_adicionales": {
    "plegable": true,
    "tiempo_plegado": "3 segundos",
    "manillar_ajustable": false,
    "guardabarros": true,
    "soporte_lateral": true
  },
  "garantia": {
    "duracion": "24 meses",
    "cobertura": "Motor y batería"
  }
}
```

## ❓ FAQ

### P: Preciso preencher todos os campos?
**R:** Não! Todos os campos são opcionais. Preencha apenas o que você tem informação disponível.

### P: O que acontece com modelos antigos sem especificações?
**R:** Eles continuam funcionando normalmente. O sistema exibe os campos básicos (velocidade, autonomia, peso, potência, tempo de carga) se não houver especificações detalhadas.

### P: Posso adicionar novos campos no futuro?
**R:** Sim! A estrutura JSONB é flexível. Basta atualizar a interface TypeScript em `src/types/especificaciones.ts` e os componentes correspondentes.

### P: Como as especificações afetam o SEO?
**R:** Todas as especificações são incluídas no structured data (JSON-LD) da página, melhorando a indexação e possibilitando rich snippets nos resultados de busca do Google.

### P: Posso importar especificações em massa?
**R:** Atualmente não há interface para importação em massa, mas você pode usar a API do Supabase diretamente para inserir dados em lote.

## 🆘 Suporte

Para dúvidas ou problemas:
1. Consulte a documentação completa: `docs/TECHNICAL_SPECIFICATIONS_SYSTEM.md`
2. Verifique os exemplos de código nos componentes
3. Entre em contato com a equipe de desenvolvimento

## 📚 Recursos Adicionais

- **Documentação Completa:** `docs/TECHNICAL_SPECIFICATIONS_SYSTEM.md`
- **Tipos TypeScript:** `src/types/especificaciones.ts`
- **Componente Admin:** `src/components/admin/ModelSpecificationsManager.tsx`
- **Componente Público:** `src/components/catalog/TechnicalSpecifications.tsx`

