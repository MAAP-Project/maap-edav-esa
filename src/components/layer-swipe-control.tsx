import React from 'react';
import { Badge } from 'antd';

import { MapLayerSwipeTool } from '@oidajs/ui-react-antd';
import { useLayerSwipeInteractionFromModule, useSelector } from '@oidajs/ui-react-mobx';
import { DatasetExplorer } from '@oidajs/eo-mobx';

export type LayerSwipeControlProps = {
    datasetExplorer: DatasetExplorer;
};

export const LayerSwipeControl = (props: LayerSwipeControlProps) => {
    const swipeProps = useLayerSwipeInteractionFromModule();
    const targetDatasetName = useSelector(() => {
        const sourceId = swipeProps?.sourceLayersIds ? swipeProps?.sourceLayersIds[0] : undefined;
        const targetDataset = props.datasetExplorer.items.find((item) => item.mapViz?.mapLayer?.id === sourceId);
        return (
            <div className='layer-swipe-control-header'>
                <Badge color={targetDataset?.dataset.config.color}></Badge>
                <span className='layer-swipe-control-label'>{targetDataset?.mapViz?.name}</span>
            </div>
        );
    }, [swipeProps]);

    if (swipeProps) {
        return <MapLayerSwipeTool sourceName={targetDatasetName} referenceName='Other map layers' horizontalMargin={10} {...swipeProps} />;
    } else {
        return null;
    }
};
