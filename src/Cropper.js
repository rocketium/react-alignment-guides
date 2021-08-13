import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import cornerNotch from './assets/cornerNotch.svg';
import middleNotch from './assets/middleNotch.svg';
import styles from './styles.scss';
import { Rnd } from "react-rnd";


export default class Cropper extends Component {
    constructor(props) {
        super(props);
        this.onImageLoaded = this.onImageLoaded.bind(this);
        this.calculateNewScale = this.calculateNewScale.bind(this);
        this.state = {
            translateX : 0,
            translateY : 0,
            scale: null,
            centerSet: false
        }
        this.escFunction = this.escFunction.bind(this);
        this.myRef = React.createRef();
        this.initCenterRef = React.createRef();
        this.calculateNewObjectPositionAndScale = this.calculateNewObjectPositionAndScale.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.endCropModeAndSave = this.endCropModeAndSave.bind(this);
    }

    handleClickOutside(event)  {
        const domNode = ReactDOM.findDOMNode(this);
    
        if (!domNode || !domNode.contains(event.target)) {
            this.endCropModeAndSave();
        }
    }
    
    escFunction(event) {
        if (event.keyCode === 27) {
            this.endCropModeAndSave();
        }
    }

    endCropModeAndSave() {
        const scale = this.state.scale || this.props.zoomScale;

        this.calculateNewObjectPositionAndScale();

        this.props.endCropMode({
            boxTranslateX: this.state.boxTranslateX || 0,
            boxTranslateY: this.state.boxTranslateY || 0,
            boxDeltaWidth: this.state.boxDeltaWidth || 0,
            boxDeltaHeight: this.state.boxDeltaHeight || 0,
            scale,
            clientXPercentage: this.state.clientXPercentage ? this.state.clientXPercentage : this.props.objectPosition.horizontal,
            clientYPercentage: this.state.clientYPercentage ? this.state.clientYPercentage : this.props.objectPosition.vertical
        });
    }
    
    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);
        document.addEventListener('click', this.handleClickOutside, true);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction, false);
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    componentDidUpdate(previousProps, previousState) {
        if (!previousState.centerSet) {
            if (this.initCenterRef && this.initCenterRef.current) {
                this.setState({
                    initCenterRect : this.initCenterRef.current.getBoundingClientRect(),
                    centerSet: true
                })            
            }
        }
    }

    calculateNewObjectPositionAndScale() {
        const currentCenter = this.myRef?.current?.getBoundingClientRect();
        const {initCenterRect} = this.state;

        const differenceInX =  currentCenter?.x - initCenterRect?.x - (this.state.boxTranslateX || 0);
        const differenceInY =  currentCenter?.y - initCenterRect?.y - (this.state.boxTranslateY || 0);
        const newScale = this.state.scale || this.props.zoomScale || 1;

        let clientXPercentage = 0;

        if (!isNaN(differenceInX) && differenceInX !== 0) {
            clientXPercentage = (((differenceInX /  this.props.renderedResolution.width) * 100) / newScale);
            this.setState({
                clientXPercentage
            })
        }

        let clientYPercentage = 0;

        if (!isNaN(differenceInY) && differenceInY !== 0) {
            clientYPercentage = (((differenceInY / this.props.renderedResolution.height ) * 100) / newScale);   
            this.setState({
                clientYPercentage
            })
        }
    }

    calculateNewScale(e, direction, ref, delta, position) {
        const originalWidth = this.state.onLoadBoundingRect.width;
        const newScale =  Math.abs(ref.offsetWidth / originalWidth);

        this.setState({
            scale: newScale,
            width: ref.offsetWidth,
            height: ref.offsetHeight, 
            translateX: position.x, 
            translateY: position.y,
        });
    }

    onImageLoaded(e) {
        const boundingRect = e?.target?.getBoundingClientRect();

        let newScale = this.state.scale || this.props.zoomScale || 1;

        const box = this.props.boxes.find(boxItem => boxItem.identifier === this.props.identifier);

        if (this.props.imageShape === 'fillImage') {
            let fillScale = 1;
            if (Math.abs(box.width - boundingRect.width) > Math.abs(box.height - boundingRect.height)) {
                fillScale = box.width / boundingRect.width;
            } else {
                fillScale = box.height / boundingRect.height;
            }
            
            let initX = this.props.position.width/2 - (boundingRect.width * fillScale)/2;
            let initY = this.props.position.height/2 - (boundingRect.height * fillScale)/2;

            this.setState({
                onLoadBoundingRect: boundingRect,
                width: boundingRect.width * fillScale,
                height: boundingRect.height * fillScale, 
                translateX: initX, 
                translateY: initY,
                initialTranslateX: initX,
                initialTranslateY: initY,
                scale: fillScale
            })
        } else {
            let initX = this.props.position.width/2 - (boundingRect.width * newScale) / 2;
            let initY = this.props.position.height/2 - (boundingRect.height * newScale) / 2;
    
            if (this.props.objectPosition) {
                initX = initX + Math.round(((this.props.objectPosition?.horizontal || 0) * newScale * this.props.renderedResolution.width) / 100);
                initY = initY + Math.round(((this.props.objectPosition?.vertical || 0) * newScale * this.props.renderedResolution.height) / 100);
            }
            
            this.setState({
                onLoadBoundingRect: boundingRect,
                width: boundingRect.width * newScale,
                height: boundingRect.height * newScale, 
                translateX: initX, 
                translateY: initY,
                initialTranslateX: initX,
                initialTranslateY: initY,
            })
        }
    }


    render() {
        const draggableStyle = {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "solid 1px #1b47f3",
            background: "transparent"
        };

        const innerDraggableStyle = {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "solid 1px #636363",
            background: "transparent"
        }

        const newScale = this.state.scale || this.props.zoomScale || 1;

        const outerImageWidth = this.state.width || this?.rnd?.props?.default?.width;
        const outerImageHeight = this.state.height || this?.rnd?.props?.default?.height;

        let outerImageStyles = {"max-height": "100%", position: 'absolute', filter: 'brightness(0.6)', opacity: '0', transform: `translate(${this.state.translateX}px, ${this.state.translateY}px)`};
        
        if (this.state.onLoadBoundingRect) {
            outerImageStyles =  {position: 'absolute', filter: 'brightness(0.6)', opacity: '0.75', 'max-width': 'none', width: outerImageWidth, height: outerImageHeight, transform: `translate(${this.state.translateX}px, ${this.state.translateY}px)`}
        }

        const innerImageStyles = this.state.onLoadBoundingRect ? {'max-width': 'none', width: outerImageWidth, height: outerImageHeight, transform: `translate(${this.state.translateX - (this.state.boxTranslateX || 0)}px, ${this.state.translateY - (this.state.boxTranslateY || 0)}px)`} : 
            {objectFit: this.props.imageShape === 'fillImage' ? 'cover' : 'contain', transform: `scale(${newScale}) translate(${this.state.translateX}px, ${this.state.translateY}px)`, opacity: '0'};

        const cropperNotchesContainerStyles = {border: '4px solid #00000020', position: 'absolute', width: `calc(100% + ${this.state.boxDeltaWidth || 0}px)`, height: `calc(100% + ${this.state.boxDeltaHeight || 0}px)`, transform: `translate(${this.state.boxTranslateX}px, ${this.state.boxTranslateY}px)`}

        return (
            <div id='cropper'>
                <img onLoad={this.onImageLoaded} draggable="false" style={outerImageStyles} src={this.props.url} />

                <div style={{ width: `calc(100% + ${this.state.boxDeltaWidth || 0}px)`, height: `calc(100% + ${this.state.boxDeltaHeight || 0}px)`, transform: `translate(${this.state.boxTranslateX}px, ${this.state.boxTranslateY}px)`, 'pointer-events': 'none', overflow: 'hidden', position: 'absolute'}}>
                    <img draggable="false" style={innerImageStyles} src={this.props.url} />
                </div>
                <div className={styles.cropper_border}> <div ref={this.initCenterRef} style={{color: 'red', width: "1px", height: "1px"}}/>  </div>

                <div style={cropperNotchesContainerStyles}>
                    <img src={cornerNotch} className={styles.cropper_notch_lt} />
                    <img src={cornerNotch} className={styles.cropper_notch_rt} />
                    <img src={cornerNotch} className={styles.cropper_notch_rb} />
                    <img src={cornerNotch} className={styles.cropper_notch_lb} />
                    <img src={middleNotch} className={styles.cropper_notch_tc} />
                    <img src={middleNotch} className={styles.cropper_notch_rc} />
                    <img src={middleNotch} className={styles.cropper_notch_bc} />
                    <img src={middleNotch} className={styles.cropper_notch_lc} />                    
                </div>

                {this.state.onLoadBoundingRect && <Rnd
                    ref={c => { this.rnd = c; }}
                    lockAspectRatio={true}
                    onDragStop={(e, d) => {
                        this.setState({
                            translateX: d.x, 
                            translateY: d.y, 
                        })                       
                    }}
                    onResizeStop={(e, direction, ref, delta, position) => this.calculateNewScale(e, direction, ref, delta, position)}
                    style={draggableStyle}
                    default={{
                        x: this.state.translateX,
                        y: this.state.translateY,
                        width: this.state.width,
                        height: this.state.height
                    }}
                > <div ref={this.myRef} style={{color: 'red', width: "1px", height: "1px"}}/> </Rnd>}

                {this.state.onLoadBoundingRect && <Rnd
                    lockAspectRatio={false}
                    style={innerDraggableStyle}
                    enableResizing={{
                        top: false,
                        right: false,
                        bottom: false,
                        left: false,
                        topRight: false,
                        bottomRight: false,
                        bottomLeft: false,
                        topLeft: false
                    }}
                    onResizeStop={(e, direction, ref, delta, position) =>{
                        // this.props.onResizeBox(delta, position);
                        console.log(e, direction, ref, delta, position);
                        this.setState({
                            boxDeltaWidth: (this.state.boxDeltaWidth || 0) + delta.width,
                            boxDeltaHeight: (this.state.boxDeltaHeight || 0) + delta.height,
                            boxTranslateX: position.x,
                            boxTranslateY: position.y
                        })
                    }}
                    onDragStop={(e, d) => {
                        this.setState({
                            boxTranslateX: d.x,
                            boxTranslateY: d.y
                        })
                        console.log(d);
                    }}
                    default={{
                        x: 0,
                        y: 0,
                        width: '100%',
                        height: '100%'
                    }}
                />}
            </div>
        )
    }
}
