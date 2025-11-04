# Ignitions from Power Lines in Greece

**Storymap Project for WWF Greece**  

## ***Maps, images and visualisations can be found here: https://arcg.is/1Ti58W1***


_Reported cases and proximity of ignition incidents to power lines and urban areas: pattern analysis despite limited data_  

**Funded by the EU intergovernmental framework European Cooperation in Science and Technology (COST) Action CA22164 NERO (european Network on Extreme fiRe behaviOr)**  


---

## Overview

Sparks from power lines are a recognized cause of wildfires worldwide. In Greece, several catastrophic fires have been linked to faults in the electricity network, yet systematic research and openly accessible data remain scarce.  

This repository contains the scripts, datasets, and methodology used to create the **Storymap “Ignitions from Power Lines in Greece”** for **WWF Greece**, exploring spatial patterns of wildfire ignitions and their proximity to power infrastructure and urban areas.

---

## Objectives

- Analyze wildfire ignition patterns linked to electricity causes.  
- Retrieve and process satellite imagery using Google Earth Engine.  
- Map and quantify proximity of ignition points to high-voltage power lines.  
- Cross-reference official and NGO datasets to highlight knowledge gaps.  
- Support fire prevention recommendations for policymakers and researchers.

---

## Data Sources

- **Hellenic Fire Service:** 40,842 ignition cases (2000–2023), including 736 electricity-related.  
- **Public Fire Service Data (2020–2024):** 46,456 fire records with coordinates.  
- **WWF Greece Dataset:** 72 confirmed electricity-caused wildfires (2007–2025).  
- **OpenStreetMap:** High-voltage power line geodata.  
- **CORINE Land Cover (Copernicus):** Land-use classification.  
- **Sentinel-2 Imagery (ESA):** Burn severity analysis using dNBR index.  

**Note:** Data for low- and medium-voltage lines (controlled by HEDNO/ΔΕΔΔΗΕ) remain inaccessible to the public.

---

## Technical Workflow

### 1. Google Earth Engine (JavaScript)

- Retrieve **Sentinel-2 MSI Level-2A** imagery.  
- Compute **dNBR (Differenced Normalized Burn Ratio)** to detect fire scars.  
- Visualize pre- and post-fire conditions.  
- Export raster and vector data for further GIS or Python analysis.

### 2. Python and Jupyter Scripts

- Process and clean wildfire datasets (CSV and shapefiles).  
- Perform spatial joins and proximity calculations between fires and power lines.  
- Integrate **CORINE Land Cover** and **OpenStreetMap** data layers.  
- Generate GeoJSON and statistical summaries for visualization and reporting.

**Core Libraries:** `geopandas`, `rasterio`, `shapely`, `pandas`, `folium`

---

## Key Findings

- **55%** of burned areas in Greece (2025) were linked to the electricity network.  
- **90%** of medium- and low-voltage power lines remain above ground, increasing vulnerability.  
- **219** fires (2020–2024) occurred within **15 m** of high-voltage lines.  
- Confirmed recurrent ignitions in **Tatoi (2021)**, **East Attica (2024)**, and **Kythira (2025)**.  
- Fire scars validated via **Sentinel-2** imagery using **dNBR** fire-severity analysis.  

---

## Recommendations

- **Transparency:** Publish official data on electricity-related ignitions.  
- **Digitization:** Release public GIS layers for low- and medium-voltage networks.  
- **Fire Risk Mapping:** Integrate multi-criteria hazard models along power corridors.  
- **Targeted Mitigation:** Prioritize vegetation and technical maintenance in high-risk areas.  
- **Future Strategy:** Gradually phase out above-ground networks.

---

## Acknowledgements

This Storymap was produced under **COST Action CA22164 NERO (European Network on Extreme fiRe behaviOr)**, supported by the **European Cooperation in Science and Technology (COST)** through a **Short-Term Scientific Mission (STSM)**.  

**Collaborating Institutions:**  
WWF Greece • COST NERO • Greek Ministry for Climate Crisis and Civil Protection • Volunteers and GIS experts  






