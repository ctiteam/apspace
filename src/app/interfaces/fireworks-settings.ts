export interface FireworksSettings {
    message: string;
    subMessage: string;
    fontStyle: FontStyle;
    launchImageStyle: LaunchImageStyle;
    headerImage: string;
    backgroundColor: string;
}

export interface FontStyle {
    color: string;
    textShadow: string;
    fontFamily: string;
    fontSize: string;
}

export interface LaunchImageStyle {
    launchImage: string;
    top: string;
    left: string;
    width: string;
}
