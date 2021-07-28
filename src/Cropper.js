import React, { Component } from 'react';
import Draggable from 'react-draggable'; // The default
import cornerNotch from './assets/cornerNotch.svg';
import middleNotch from './assets/middleNotch.svg';
import styles from './styles.scss';
import { Rnd } from "react-rnd";


export default class Cropper extends Component {
    constructor(props) {
        super(props);
        this.handleImageLoaded = this.handleImageLoaded.bind(this);
        this.calculateNewScale = this.calculateNewScale.bind(this);
        this.state = {
            translateX : 0,
            translateY : 0,
            scale: null
        }
        this.escFunction = this.escFunction.bind(this);
    }
    escFunction(event) {
        if (event.keyCode === 27) {
            this.props.endCropMode();
        }
    }
    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction, false);
    }

    calculateNewScale(e, direction, ref, delta, position) {
        const originalWidth = this.state.onLoadBoundingRect.width / this.props.zoomScale ;
        const newScale =  Math.abs(ref.offsetWidth / originalWidth);
        let newTranslateX =  0; //this.state.translateX + delta.width;
        let newTranslateY = 0; //this.state.translateY + delta.height;
        
        if (direction === 'topLeft') {
            newTranslateX = this.state.translateX - delta.width;
            newTranslateY = this.state.translateY - delta.height; 
        } else if (direction === 'topRight') {
            newTranslateX = this.state.translateX + delta.width;
            newTranslateY = this.state.translateY - delta.height; 
        } else if (direction === 'bottomLeft') {
            newTranslateX = this.state.translateX - delta.width;
            newTranslateY = this.state.translateY + delta.height; 
        } else if (direction === 'bottomRight') {
            newTranslateX = this.state.translateX + delta.width;
            newTranslateY = this.state.translateY + delta.height;       
        }

        this.setState({
            isMoved: true,
            scale: newScale,
            width: ref.offsetWidth, //position.width,
            height: ref.offsetHeight, //position.height,
            translateX: position.x, //position.x - (this.props.position.width / 2 - this.state.onLoadBoundingRect.width / 2),
            translateY: position.y, //position.y - (this.props.position.height / 2 - this.state.onLoadBoundingRect.height / 2) 
        })
        console.log('New scale', newScale);
    }

    handleImageLoaded(e) {
        console.log('image loaded: ', e?.current?.target);
        this.setState({
            onLoadBoundingRect: e?.target?.getBoundingClientRect()
        })
    }


    render() {
        const draggableStyle = {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "solid 1px #f00",
            background: "transparent"
        };

        const newScale = this.state.scale || this.props.zoomScale;

        const width = this.state.width || this?.rnd?.props?.default?.width;
        const height = this.state.height || this?.rnd?.props?.default?.height;


        const outerImageStyles = this.state.isMoved ? {position: 'absolute', filter: 'brightness(0.6)', opacity: '0.75', 'max-width': 'none', width, height, transform: `translate(${this.state.translateX}px, ${this.state.translateY}px)`} : {position: 'absolute', filter: 'brightness(0.6)', opacity: '0.75', transform: `scale(${newScale}) translate(${this.state.translateX}px, ${this.state.translateY}px)`};
        const innerImageStyles = this.state.isMoved ? {'max-width': 'none', width, height, transform: `translate(${this.state.translateX}px, ${this.state.translateY}px)`} : {transform: `scale(${newScale}) translate(${this.state.translateX}px, ${this.state.translateY}px)`};

        return (
            <>
                <img onLoad={this.handleImageLoaded} draggable="false" style={outerImageStyles} src={this.props.url} />


                <div style={{ width: '100%', height: '100%', 'pointer-events': 'none', overflow: 'hidden'}}>
                    <img onLoad={this.handleImageLoaded} draggable="false" style={innerImageStyles} src={this.props.url} />
                </div>
                <div className={styles.cropper_border} />

                {this.state.onLoadBoundingRect && <Rnd
                    ref={c => { this.rnd = c; }}
                    lockAspectRatio={true}
                    onDragStop={(e, d) => {
                        this.setState({
                            isMoved: true,
                            translateX: d.x, // (d.x - (this.props.position.width / 2 - this.state.onLoadBoundingRect.width / 2)),
                            translateY: d.y, // (d.y - (this.props.position.height / 2 - this.state.onLoadBoundingRect.height / 2))
                        })
                    }}
                    onResizeStop={(e, direction, ref, delta, position) => this.calculateNewScale(e, direction, ref, delta, position)}
                    style={draggableStyle}
                    default={{
                        x: this.props.position.width/2 - this.state.onLoadBoundingRect.width/2 ,
                        y: this.props.position.height/2 - this.state.onLoadBoundingRect.height/2 ,
                        width: this.state.onLoadBoundingRect.width,
                        height: this.state.onLoadBoundingRect.height
                    }}
                >
                </Rnd>}

                <img src={cornerNotch} className={styles.cropper_notch_lt} />
                <img src={cornerNotch} className={styles.cropper_notch_rt} />
                <img src={cornerNotch} className={styles.cropper_notch_rb} />
                <img src={cornerNotch} className={styles.cropper_notch_lb} />
                <img src={middleNotch} className={styles.cropper_notch_tc} />
                <img src={middleNotch} className={styles.cropper_notch_rc} />
                <img src={middleNotch} className={styles.cropper_notch_bc} />
                <img src={middleNotch} className={styles.cropper_notch_lc} />
            </>
        )
    }
}
