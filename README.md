# Anti-Hail Net Mapping in Apple Orchards

## Overview

The growing use of anti-hail nets in apple orchards has contributed to mitigating the impacts of extreme weather events, such as hailstorms and frosts, particularly in regions with high climate vulnerability. However, the expansion of these protective structures requires effective methodologies for large-scale monitoring, with a focus on both agronomic and environmental management. This study aimed to develop and test a remote sensing approach combined with machine-learning techniques to map anti-hail nets in the municipality of Vacaria, in the state of Rio Grande do Sul, Brazil. Sentinel-2 imagery was used, incorporating the blue, green, red, and nearinfrared spectral bands, processed using the Google Earth Engine platform. K-means segmentation was applied, and Random Forest classifiers were employed using both pixel-based and object-based classification approaches. A total of 800 sample points were used, split between training and validation, and classification accuracy was assessed using confusion matrices and the kappa index. The pixel-based approach outperformed the object-based classification, yielding a kappa index of 0.67, an overall accuracy of 0.76, and a class accuracy of 0.95 for net-covered orchards. The results confirm the technical feasibility of the proposed methodology for mapping plastic agricultural structures.

## Methodology

## Methodology

Sentinel-2 MSI Level-2A surface reflectance imagery was used, considering the blue (B2), green (B3), red (B4), and near-infrared (B8) bands, all with a 10 m spatial resolution. Cloud masking and scene selection were performed to generate a cloud-free mosaic covering the study area. Spectral indices, including the Normalized Difference Vegetation Index (NDVI), were also calculated to improve the discrimination of spectrally similar classes.

Two classification approaches were evaluated: pixel-based classification and object-based image analysis (OBIA). Both approaches used the supervised Random Forest algorithm. For OBIA, image segmentation was performed using the unsupervised K-means algorithm to group pixels according to their spectral characteristics and spatial patterns.

Four thematic classes were considered: orchards protected by anti-hail nets, unprotected orchards, dense native vegetation, and secondary vegetation. A total of 800 sample points were used, with 70% allocated for model training and 30% for validation. The secondary vegetation class was included to reduce confusion with anti-hail nets, which may exhibit similar spectral responses in certain image compositions.

A spatial post-processing step based on neighborhood analysis was applied to reduce isolated classification errors and improve the spatial consistency of the resulting maps. The pixel-based and OBIA classifications were then compared in terms of the total area identified as protected by anti-hail nets and the accuracy of the target-class detection.

As an additional reference for validation, the areas protected by anti-hail nets were manually digitized through visual interpretation of the satellite imagery.

## Study Area

## Study Area

Apple production in Brazil is strongly concentrated in the southern region, particularly in the states of Rio Grande do Sul (RS) and Santa Catarina (SC), which together accounted for approximately 97% of the country's total production in 2023. According to data from the Municipal Agricultural Production Survey (IBGE, 2023), Brazil produced approximately 1.2 million tonnes of apples that year.

The municipality of Vacaria, located in the Serra Gaúcha region of Rio Grande do Sul, is one of Brazil's main apple-producing areas. In 2023, Vacaria produced approximately 214,000 tonnes, representing around 40% of the state's production and nearly 18% of the national total. Its prominent position makes the municipality an important center for apple production and agricultural technology.

The region is also characterized by the widespread adoption of technologies designed to mitigate climatic risks, particularly anti-hail protection structures, such as chapel-shaped nets installed over orchards. Hail events frequently occur between July and October, motivating the use of these structures in both commercial and family-operated orchards.

The study area comprises apple-producing regions in and around Vacaria, Rio Grande do Sul, Brazil.

## Results

The performance of the pixel-based and object-based image analysis (OBIA) approaches was evaluated using confusion matrices generated from the validation samples. Overall accuracy, Cohen's kappa coefficient, and precision for the target class — orchards protected by anti-hail nets — were calculated.

The pixel-based Random Forest classification achieved the best overall performance, with an overall accuracy of 0.76, a kappa coefficient of 0.68, and a target-class precision of 0.95 (Table 1). These results indicate good agreement between the classification and the reference data, as well as a high capacity to correctly identify areas protected by anti-hail nets.

The OBIA approach also produced satisfactory results, but with slightly lower performance: an overall accuracy of 0.74, a kappa coefficient of 0.65, and a target-class precision of 0.93 (Table 1). The pixel-based approach presented lower omission and commission errors, while the OBIA classification showed a greater tendency toward overestimation, particularly in areas where secondary vegetation exhibited spectral characteristics similar to those of plastic coverings.

The estimated area covered by anti-hail nets also varied according to the classification method (Table 2). Visual digitization, used as the reference method, identified 15.8 km² of protected area. The pixel-based classification estimated 18.7 km², whereas OBIA estimated 19.9 km². Thus, the pixel-based approach overestimated the reference area by 2.9 km² (18.3%), while OBIA overestimated it by 4.1 km² (26.0%).

The greater overestimation observed in the OBIA results may be related to limitations in the K-means segmentation process, which can inadequately delineate areas of interest in heterogeneous agricultural landscapes. Spectrally similar targets, such as anti-hail nets and sparse vegetation or exposed soil, may be grouped into the same objects, increasing the inclusion of adjacent areas.

The 10 m spatial resolution of Sentinel-2 imagery is an additional limitation when distinguishing spectrally similar features. Nevertheless, the pixel-based approach showed better performance, potentially due to its greater sensitivity to subtle spectral variations, particularly in the near-infrared (NIR) band, where anti-hail net coverings may exhibit high reflectance.

The results indicate that Sentinel-2 imagery combined with Random Forest classification is a technically viable approach for mapping and estimating the spatial extent of protected orchards. The findings also highlight the importance of field validation and reference mapping to reduce false positives and improve the reliability of agricultural monitoring (Figures 1 and 2).

![Figure 1. Visual vectorization; Pixel-based Random Forest classifier.](figures/Zoom2-VetorizacaoReal_X_VetorizacaoModeloRF.png)
Figure 1. Visual vectorization; Pixel-based Random Forest classifier.

![Figure 2. Visual vectorization; Object-Based Image Analysis (OBIA) Random Forest classifier.](figures/Zoom2_VetorizacaoReal_X_VetorizacaoModeloKMeans+RF.png)
Figure 2. Visual vectorization; Object-Based Image Analysis (OBIA) Random Forest classifier.

## Future Developments

The project is currently being expanded to a broader study area, covering apple-producing regions in both Rio Grande do Sul and Santa Catarina, Brazil. In parallel, the processing and classification workflow is being migrated from Google Earth Engine to Python, enabling the investigation of more advanced machine learning and image processing techniques.

The expanded methodology includes the incorporation of two additional classes — agricultural structures and water bodies — as well as the short-wave infrared (SWIR) bands, which may provide additional spectral information for distinguishing anti-hail nets from surrounding land-cover types.

The preliminary experiments conducted using the expanded dataset indicate promising classification performance. Among the algorithms evaluated so far, Random Forest achieved the best results, with an overall accuracy of 0.9773 and a kappa coefficient of 0.9723. The K-Nearest Neighbors (KNN) algorithm achieved an overall accuracy of 0.8864 and a kappa coefficient of 0.8616. These results suggest that the expanded feature set and classification workflow may substantially improve the discrimination of land-cover classes, although further testing and validation are still required.

A preliminary result of the ongoing workflow is presented in Figure 3, showing the first classification produced for a smaller portion of the expanded study area.


Figure 3. Preliminary classification result generated using the Random Forest algorithm during the ongoing expansion of the project, showing a subset of the broader study area.

Because the project is part of an ongoing scientific research effort, some datasets, intermediate products, and updated results are subject to data-sharing restrictions. Therefore, this repository currently provides the code and results associated with the published study, developed in Google Earth Engine, while the ongoing Python-based expansion is presented only through selected preliminary results.
