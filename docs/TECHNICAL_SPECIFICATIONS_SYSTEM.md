# Sistema de Especificações Técnicas - Patinetas Eléctricas

## 📋 Visão Geral

Este documento descreve o sistema completo de especificações técnicas (ficha técnica) implementado para os modelos de patinetas elétricas no site patinetaelectrica.com.co.

## 🎯 Objetivo

Fornecer uma estrutura padronizada, flexível e completa para armazenar e exibir todas as especificações técnicas dos modelos de patinetas elétricas, melhorando a experiência do usuário e o SEO do site.

## 🏗️ Arquitetura

### Abordagem Escolhida: Campo JSONB

Optamos por expandir o campo JSONB `especificaciones` existente na tabela `modelos_patinetas` ao invés de criar uma nova tabela. Esta abordagem oferece:

✅ **Vantagens:**
- Não requer alteração de schema do banco de dados
- Flexibilidade para adicionar novos campos no futuro
- Mantém compatibilidade com dados existentes
- Fácil de implementar e manter
- Permite estruturas complexas e aninhadas

## 📊 Estrutura de Dados

### Interface TypeScript Principal

```typescript
export interface EspecificacionesTecnicas {
  bateria?: BateriaEspecificaciones
  motor?: MotorEspecificaciones
  rendimiento?: RendimientoEspecificaciones
  dimensiones?: DimensionesEspecificaciones
  neumaticos?: NeumaticosEspecificaciones
  frenos?: FrenosEspecificaciones
  suspension?: SuspensionEspecificaciones
  seguridad?: SeguridadEspecificaciones
  display?: DisplayEspecificaciones
  conectividad?: ConectividadEspecificaciones
  modos_conduccion?: ModosConduccionEspecificaciones
  caracteristicas_adicionales?: CaracteristicasAdicionalesEspecificaciones
  contenido_caja?: ContenidoCajaEspecificaciones
  garantia?: GarantiaEspecificaciones
  notas?: string
}
```

### Categorias de Especificações

#### 🔋 Bateria
- Voltaje (ex: "36V", "48V")
- Capacidad (ex: "10Ah", "15Ah")
- Capacidad en Wh
- Tipo (ex: "Litio", "Li-ion")
- Removible (boolean)
- Tiempo de carga
- Cargador

#### ⚡ Motor
- Potencia (watts)
- Potencia pico
- Tipo (ex: "Brushless", "Hub motor")
- Ubicación (ex: "Rueda trasera")
- Tracción

#### 🚀 Rendimiento
- Velocidad máxima (km/h)
- Velocidad real
- Autonomía (km)
- Autonomía real
- Carga máxima (kg)
- Grado de subida (°)
- Aceleración

#### 📏 Dimensiones y Peso
- Dimensiones desplegada
- Dimensiones plegada
- Peso (kg)
- Altura/ancho plataforma

#### 🛞 Neumáticos
- Tamaño delantero/trasero
- Tipo (ex: "Neumáticos", "Sólidos")
- Material
- Presión
- Marca

#### 🛑 Frenos
- Tipo delantero/trasero
- Sistema (ex: "Disco dual")
- Descripción
- Distancia de frenado

#### 🔧 Suspensión
- Delantera/trasera
- Tipo
- Recorrido
- Ajustable (boolean)

#### 🔒 Seguridad
- Resistencia al agua (ex: "IP54")
- Certificaciones (array)
- Luces delanteras/traseras
- Reflectores (boolean)
- Bocina (boolean)
- Sistema de seguridad
- Bloqueo

#### 📱 Display y Controles
- Tipo (ex: "LCD", "LED")
- Tamaño
- Información mostrada (array)
- Iluminación (boolean)
- Controles

#### 📡 Conectividad
- App (ex: "Mi Home")
- Bluetooth (boolean)
- GPS (boolean)
- WiFi (boolean)
- Puerto de carga
- Puerto USB (boolean)

#### 🎮 Modos de Conducción
- Modos disponibles (array)
- Velocidad por modo
- Cruise control (boolean)
- Arranque

#### ✨ Características Adicionales
- Plegable (boolean)
- Tiempo de plegado
- Portátil (boolean)
- Manillar ajustable (boolean)
- Altura manillar
- Soporte lateral (boolean)
- Guardabarros (boolean)
- Portaequipajes (boolean)
- Colores disponibles (array)

#### 📦 Contenido de la Caja
- Incluye (array)
- Accesorios opcionales (array)

#### 🛡️ Garantía
- Duración
- Cobertura
- Soporte técnico

## 🔧 Componentes Implementados

### 1. Tipos TypeScript (`src/types/especificaciones.ts`)

Define todas as interfaces e tipos para as especificações técnicas.

**Funções Helper:**
- `createEmptyEspecificaciones()` - Cria objeto vazio com estrutura padrão
- `isValidEspecificaciones()` - Valida estrutura
- `mergeEspecificaciones()` - Mescla especificações preservando dados

### 2. Componente Admin (`src/components/admin/ModelSpecificationsManager.tsx`)

Interface administrativa para gerenciar especificações técnicas.

**Características:**
- Sistema de abas para organizar categorias
- Todos os campos são opcionais
- Validação de tipos
- Interface intuitiva com ícones

**Uso:**
```tsx
<ModelSpecificationsManager
  initialData={especificaciones}
  onChange={handleSpecificationsChange}
/>
```

### 3. Componente Público (`src/components/catalog/TechnicalSpecifications.tsx`)

Exibe a ficha técnica completa na página pública do modelo.

**Características:**
- Layout em grid responsivo
- Organizado por categorias com ícones
- Exibe apenas campos preenchidos
- Compatibilidade com campos legados
- Design limpo e profissional

**Uso:**
```tsx
<TechnicalSpecifications
  specifications={model.especificaciones}
  velocidad_maxima={model.velocidad_maxima}
  autonomia={model.autonomia}
  peso={model.peso}
  potencia={model.potencia}
  tiempo_carga={model.tiempo_carga}
/>
```

### 4. Structured Data (JSON-LD)

Função helper para gerar structured data completo com todas as especificações para SEO.

**Localização:** `src/app/catalogo/marcas/[brandSlug]/[modelSlug]/ModelDetailClient.tsx`

**Função:** `generateStructuredData(model: ModeloPatineta)`

## 📝 Como Usar

### Adicionar Especificações a um Modelo (Admin)

1. Acesse `/admin/models/new` ou `/admin/models/[id]`
2. Clique na aba "Ficha Técnica"
3. Navegue pelas sub-abas (Bateria, Motor, etc.)
4. Preencha os campos desejados
5. Salve o modelo

**Nota:** Todos os campos são opcionais. Preencha apenas o que estiver disponível.

### Visualizar Especificações (Público)

As especificações são exibidas automaticamente na página do modelo:
`/catalogo/marcas/{marca}/{modelo}`

## 🔄 Compatibilidade

### Campos Legados

Os campos diretos na tabela `modelos_patinetas` são mantidos para compatibilidade:
- `velocidad_maxima`
- `autonomia`
- `peso`
- `potencia`
- `tiempo_carga`

Estes campos continuam funcionando e são exibidos mesmo se `especificaciones` estiver vazio.

### Migração de Dados

Não é necessária migração de dados. O sistema funciona com:
- Modelos sem especificações (exibe apenas campos legados)
- Modelos com especificações parciais (exibe o que estiver preenchido)
- Modelos com especificações completas (exibe tudo)

## 🎨 Design e UX

### Interface Admin
- **Abas organizadas** por categoria
- **Ícones visuais** para fácil identificação
- **Campos agrupados** logicamente
- **Tooltips e placeholders** informativos

### Interface Pública
- **Layout em grid** responsivo (1-3 colunas)
- **Seções colapsáveis** por categoria
- **Ícones grandes** para cada seção
- **Destaque visual** para valores importantes
- **Compatível com mobile**

## 🔍 SEO

### Structured Data (Schema.org)

Todas as especificações são incluídas no structured data como `PropertyValue`:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Mi Electric Scooter Pro 2",
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "Velocidad Máxima",
      "value": "25 km/h"
    },
    {
      "@type": "PropertyValue",
      "name": "Resistencia al Agua",
      "value": "IPX4"
    }
    // ... mais propriedades
  ]
}
```

### Benefícios SEO
- ✅ Rich snippets nos resultados de busca
- ✅ Melhor indexação de especificações
- ✅ Maior relevância para buscas específicas
- ✅ Dados estruturados validados pelo Google

## 🚀 Próximos Passos (Opcional)

A tarefa de **filtros avançados** foi deixada como opcional. Se desejado, pode-se implementar:

1. **Filtros no Catálogo**
   - Filtrar por resistência à água
   - Filtrar por tipo de bateria
   - Filtrar por potência do motor
   - Filtrar por características (plegable, app, etc.)

2. **Comparação de Modelos**
   - Comparar especificações lado a lado
   - Destacar diferenças
   - Exportar comparação

3. **Busca Avançada**
   - Buscar por especificações específicas
   - Sugestões inteligentes
   - Filtros combinados

## 📚 Referências

- **Tipos:** `src/types/especificaciones.ts`
- **Admin:** `src/components/admin/ModelSpecificationsManager.tsx`
- **Público:** `src/components/catalog/TechnicalSpecifications.tsx`
- **Páginas Admin:** `src/app/admin/models/[new|[id]]/page.tsx`
- **Página Pública:** `src/app/catalogo/marcas/[brandSlug]/[modelSlug]/ModelDetailClient.tsx`

## ✅ Checklist de Implementação

- [x] Criar interfaces TypeScript para especificações
- [x] Atualizar interface ModeloPatineta
- [x] Criar componente admin para gerenciar especificações
- [x] Integrar componente admin nas páginas de criação/edição
- [x] Criar componente público para exibir ficha técnica
- [x] Integrar componente público na página do modelo
- [x] Atualizar structured data (JSON-LD) com especificações
- [x] Documentar sistema completo
- [ ] Implementar filtros avançados (opcional)
- [ ] Implementar comparação de modelos (opcional)

## 🎉 Conclusão

O sistema de especificações técnicas está completo e pronto para uso! Todos os campos são opcionais e o sistema é totalmente compatível com dados existentes. A estrutura é flexível e pode ser facilmente expandida no futuro.

