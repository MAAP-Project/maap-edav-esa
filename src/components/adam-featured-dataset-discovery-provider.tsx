import React from 'react';

import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

import { IFormFieldDefinition, STRING_FIELD_ID } from '@oida/core';
import { DataCollectionCompactListItem, DataCollectionList } from '@oida/ui-react-antd';
import { useFormData, useDataPaging, useDataSorting, useEntityCollectionList, useQueryCriteriaUrlBinding, useMapSelection } from '@oida/ui-react-mobx';
import { DatasetExplorer } from '@oida/eo-mobx';
import { DatasetDiscoveryProviderFactory } from '@oida/eo-mobx-react';
import {
    AdamFeaturedDatasetDiscoveryProvider as AdamDatasetDiscoveryProviderState,
    AdamFeaturedDatasetDiscoveryProviderItem,
    ADAM_FEATURED_DATASET_DISCOVERY_PROVIDER_TYPE
} from '@oida/eo-adapters-adam';


export type AdamFeaturedDatasetDiscoveryProviderProps = {
    provider: AdamDatasetDiscoveryProviderState;
    datasetExplorer: DatasetExplorer
};

export const AdamFeaturedDatasetDiscoveryProvider = (props: AdamFeaturedDatasetDiscoveryProviderProps) => {

    const searchFilters: IFormFieldDefinition[] = [
        {
            name: 'q',
            type: STRING_FIELD_ID,
            config: {},
            rendererConfig: {
                props: {
                    prefix: (<SearchOutlined/>)
                }
            }
        }
    ];

    const actions = [
        {
            name: 'Add to map',
            content: 'Add to map',
            icon: (<PlusOutlined/>),
            callback: (item: AdamFeaturedDatasetDiscoveryProviderItem) => {
                props.provider.createDataset(item.dataset).then((datasetConfig) => {
                    return props.datasetExplorer.addDataset(datasetConfig);
                });
            },
            condition: (entity) => {
                return true;
            }
        }
    ];

    useQueryCriteriaUrlBinding({
        criteria: props.provider.criteria
    });

    const pagingProps = useDataPaging(props.provider.criteria.paging);

    const filteringProps = useFormData({
        fieldValues: props.provider.criteria.filters,
        fields: searchFilters
    });

    const sortingProps = useDataSorting({
        sortableFields: [{key: 'name', name: 'Name'}],
        sortingState: props.provider.criteria.sorting
    });

    const mapSelection = useMapSelection();

    const items = useEntityCollectionList<AdamFeaturedDatasetDiscoveryProviderItem>({
        items: props.provider.results,
        actions: actions,
        selectionManager: mapSelection
    });


    if (!items) {
        return null;
    }

    return (
        <div className='adam-dataset-discovery-provider'>

            <DataCollectionList<AdamFeaturedDatasetDiscoveryProviderItem>
                className='dataset-discovery-results adam-dataset-discovery-results'
                content={(item) => {
                    return (
                        <DataCollectionCompactListItem
                            title={item.dataset.name}
                            description={item.dataset.description}
                        />
                    );
                }}
                items={items}
                itemLayout='vertical'
                paging={pagingProps}
                sorting={sortingProps}
                filters={filteringProps ? {
                    ...filteringProps,
                    mainFilter: 'q'
                } : undefined}
                autoScrollOnSelection={false}
            />
        </div>
    );
};

DatasetDiscoveryProviderFactory.register(ADAM_FEATURED_DATASET_DISCOVERY_PROVIDER_TYPE, (config) => {
    return <AdamFeaturedDatasetDiscoveryProvider {...config}/>;
});
