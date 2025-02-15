
import * as React from "react";
import { Vector2PropertyTabComponent } from '../../propertyTab/properties/vector2PropertyTabComponent';
import { Vector3PropertyTabComponent } from '../../propertyTab/properties/vector3PropertyTabComponent';
import { GlobalState } from '../../../globalState';
import { InputNodeModel } from './inputNodeModel';
import { NodeMaterialBlockConnectionPointTypes } from 'babylonjs/Materials/Node/nodeMaterialBlockConnectionPointTypes';
import { OptionsLineComponent } from '../../../sharedComponents/optionsLineComponent';
import { NodeMaterialSystemValues } from 'babylonjs/Materials/Node/nodeMaterialSystemValues';
import { TextLineComponent } from '../../../sharedComponents/textLineComponent';
import { Color3PropertyTabComponent } from '../../propertyTab/properties/color3PropertyTabComponent';
import { FloatPropertyTabComponent } from '../../propertyTab/properties/floatPropertyTabComponent';
import { LineContainerComponent } from '../../../sharedComponents/lineContainerComponent';
import { StringTools } from '../../../stringTools';
import { AnimatedInputBlockTypes } from 'babylonjs/Materials/Node/Blocks/Input/animatedInputBlockTypes';
import { TextInputLineComponent } from '../../../sharedComponents/textInputLineComponent';
import { CheckBoxLineComponent } from '../../../sharedComponents/checkBoxLineComponent';

interface IInputPropertyTabComponentProps {
    globalState: GlobalState;
    inputNode: InputNodeModel;
}

export class InputPropertyTabComponentProps extends React.Component<IInputPropertyTabComponentProps> {

    constructor(props: IInputPropertyTabComponentProps) {
        super(props)
    }

    renderValue(globalState: GlobalState) {
        let inputBlock = this.props.inputNode.inputBlock;
        switch (inputBlock.type) {
            case NodeMaterialBlockConnectionPointTypes.Float:
                return (
                    <FloatPropertyTabComponent globalState={globalState} inputBlock={inputBlock} />
                );
            case NodeMaterialBlockConnectionPointTypes.Vector2:
                return (
                    <Vector2PropertyTabComponent globalState={globalState} inputBlock={inputBlock} />
                );
            case NodeMaterialBlockConnectionPointTypes.Color3:
            case NodeMaterialBlockConnectionPointTypes.Color4:
                return (
                    <Color3PropertyTabComponent globalState={globalState} inputBlock={inputBlock} />
                );
            case NodeMaterialBlockConnectionPointTypes.Vector3:
                return (
                    <Vector3PropertyTabComponent globalState={globalState} inputBlock={inputBlock} />
                );
        }

        return null;
    }

    setDefaultValue() {
        let inputBlock = this.props.inputNode.inputBlock;
        inputBlock.setDefaultValue();
    }

    render() {
        let inputBlock = this.props.inputNode.inputBlock;

        var systemValuesOptions: {label: string, value: NodeMaterialSystemValues}[] = [];
        var attributeOptions: {label: string, value: string}[] = [];
        var animationOptions: {label: string, value: AnimatedInputBlockTypes}[] = [];

        switch(inputBlock.type) {      
            case NodeMaterialBlockConnectionPointTypes.Float:
                animationOptions = [
                    { label: "None", value: AnimatedInputBlockTypes.None },
                    { label: "Time", value: AnimatedInputBlockTypes.Time },
                ];
                break;      
            case NodeMaterialBlockConnectionPointTypes.Matrix:
                systemValuesOptions = [
                    { label: "World", value: NodeMaterialSystemValues.World },
                    { label: "World x View", value: NodeMaterialSystemValues.WorldView },
                    { label: "World x ViewxProjection", value: NodeMaterialSystemValues.WorldViewProjection },
                    { label: "View", value: NodeMaterialSystemValues.View },
                    { label: "View x Projection", value: NodeMaterialSystemValues.ViewProjection },
                    { label: "Projection", value: NodeMaterialSystemValues.Projection }
                ];
                break;
            case NodeMaterialBlockConnectionPointTypes.Color3:
                systemValuesOptions = [
                    { label: "Fog color", value: NodeMaterialSystemValues.FogColor }
                ];
                break;
            case NodeMaterialBlockConnectionPointTypes.Color4:
                attributeOptions = [
                    { label: "color", value: "color" }
                ];
                break;
            case NodeMaterialBlockConnectionPointTypes.Vector2:
                attributeOptions = [
                    { label: "uv", value: "uv" },
                    { label: "uv2", value: "uv2" },
                ];
                break;                
            case NodeMaterialBlockConnectionPointTypes.Vector3:
                systemValuesOptions = [
                    { label: "Camera position", value: NodeMaterialSystemValues.CameraPosition }
                ];
                attributeOptions = [
                    { label: "position", value: "position" },
                    { label: "normal", value: "normal" },
                    { label: "tangent", value: "tangent" },        
                ];
                break;
            case NodeMaterialBlockConnectionPointTypes.Vector4:
                    attributeOptions = [
                        { label: "matricesIndices", value: "matricesIndices" },
                        { label: "matricesWeights", value: "matricesWeights" }
                    ];
                    break;                
        }

        var modeOptions = [
            { label: "User-defined", value: 0 }
        ];

        if (attributeOptions.length > 0) {
            modeOptions.push({ label: "Mesh attribute", value: 1 });
        }

        if (systemValuesOptions.length > 0) {
            modeOptions.push({ label: "System value", value: 2 });
        }

        return (
            <div>
                <LineContainerComponent title="GENERAL">
                    {
                        !inputBlock.isAttribute &&
                        <TextInputLineComponent  globalState={this.props.globalState} label="Name" propertyName="name" target={inputBlock} onChange={() => this.props.globalState.onUpdateRequiredObservable.notifyObservers()} />
                    }
                    <TextLineComponent label="Type" value={StringTools.GetBaseType(inputBlock.type)} />
                </LineContainerComponent>
                <LineContainerComponent title="PROPERTIES">
                    {
                        inputBlock.isUniform && !inputBlock.isSystemValue && inputBlock.animationType === AnimatedInputBlockTypes.None &&
                        <CheckBoxLineComponent label="Visible in the Inspector" target={inputBlock} propertyName="visibleInInspector"/>
                    }                 
                    <OptionsLineComponent label="Mode" options={modeOptions} target={inputBlock} 
                        noDirectUpdate={true}
                        getSelection={(block) => {
                            if (block.isAttribute) {
                                return 1;
                            }

                            if (block.isSystemValue) {
                                return 2;
                            }

                            return 0;
                        }}
                        onSelect={(value: any) => {
                            switch (value) {
                                case 0:
                                    inputBlock.isUniform = true;
                                    inputBlock.setAsSystemValue(null);
                                    this.setDefaultValue();
                                    break;
                                case 1:
                                    inputBlock.setAsAttribute(attributeOptions[0].value);
                                    break;
                                case 2:
                                    inputBlock.setAsSystemValue(systemValuesOptions[0].value);
                                    break;
                            }
                            this.forceUpdate();
                            this.props.globalState.onRebuildRequiredObservable.notifyObservers();
                        }} />
                    {
                        inputBlock.isAttribute &&
                        <OptionsLineComponent label="Attribute" valuesAreStrings={true} options={attributeOptions} target={inputBlock} propertyName="name" onSelect={(value: any) => {
                            inputBlock.setAsAttribute(value);
                            this.forceUpdate();
                            this.props.globalState.onRebuildRequiredObservable.notifyObservers();
                        }} />
                    }
                    {
                        inputBlock.isUniform && animationOptions.length > 0 &&
                        <OptionsLineComponent label="Animation type" options={animationOptions} target={inputBlock} propertyName="animationType" onSelect={(value: any) => {
                            this.forceUpdate();
                            this.props.globalState.onRebuildRequiredObservable.notifyObservers();
                        }} />
                    }   
                    {
                        inputBlock.isUniform && !inputBlock.isSystemValue && inputBlock.animationType === AnimatedInputBlockTypes.None &&
                        this.renderValue(this.props.globalState)
                    }
                    {
                        inputBlock.isUniform && inputBlock.isSystemValue &&
                        <OptionsLineComponent label="System value" options={systemValuesOptions} target={inputBlock} propertyName="systemValue" onSelect={(value: any) => {
                            inputBlock.setAsSystemValue(value);
                            this.forceUpdate();
                            this.props.globalState.onRebuildRequiredObservable.notifyObservers();
                        }} />
                    }
                </LineContainerComponent>
            </div>
        );
    }
}