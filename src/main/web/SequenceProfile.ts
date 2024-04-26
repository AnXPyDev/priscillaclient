import WebProfile, { WebProfileFactory } from "./WebProfile";

export class SequenceProfileFactory extends WebProfileFactory {
    override create(name: string, configuration: object): WebProfile {
        return SequenceProfile.fromConfig(name, configuration);
    }
}

export default class SequenceProfile extends WebProfile {

    constructor(name: string, options: {

    }) {
        super(name, {});
    }

    static fromConfig(name: string, options: {

    }): SequenceProfile {
        return new SequenceProfile(name, {});
    }

}