import { GenericNodeWidget } from "./genericNodeWidget";
import { GenericNodeModel } from "./genericNodeModel";
import * as React from "react";
import { GlobalState } from '../../../globalState';
import { AbstractReactFactory, GenerateWidgetEvent } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export class GenericNodeFactory extends AbstractReactFactory<GenericNodeModel, DiagramEngine> {
    private _globalState: GlobalState;

	/**
	 * Constructs a GenericNodeFactory
	 */
    constructor(globalState: GlobalState) {
        super("generic");

        this._globalState = globalState;
    }

    generateReactWidget(event: GenerateWidgetEvent<GenericNodeModel>): JSX.Element {
        return <GenericNodeWidget node={event.model} globalState={this._globalState} />;
    }

	/**
	 * Gets a new instance of a node model
	 * @returns generic node model
	 */
    generateModel() {
        return new GenericNodeModel();
    }
}