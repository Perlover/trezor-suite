import React from 'react';
import styled from 'styled-components';

import { OnboardingButton, Text, Wrapper } from '@onboarding-components';
import { Translation, Image } from '@suite-components';

import { Props } from './Container';

const StyledImg = styled(props => <Image {...props} />)`
    margin: 50px 0;
`;

const SkipStep = ({ closeModalApp, goToNextStep }: Props) => (
    <Wrapper.Step>
        <Wrapper.StepHeading>
            <Translation id="TR_SKIP_ONBOARDING_HEADING" />
        </Wrapper.StepHeading>
        <Wrapper.StepBody>
            <Text>
                <Translation id="TR_SKIP_ONBOARDING_TEXT" />
            </Text>
            <StyledImg image="UNI_WARNING" />
        </Wrapper.StepBody>
        <Wrapper.Controls>
            <OnboardingButton.Cta
                data-test="@onboarding/skip-button"
                onClick={() => closeModalApp()}
            >
                <Translation id="TR_SKIP_ALL" />
            </OnboardingButton.Cta>
        </Wrapper.Controls>
        <Wrapper.StepFooter>
            <OnboardingButton.Back onClick={() => goToNextStep('welcome')}>
                <Translation id="TR_BACK_TO_ONBOARDING" />
            </OnboardingButton.Back>
        </Wrapper.StepFooter>
    </Wrapper.Step>
);

export default SkipStep;
