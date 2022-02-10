import React from 'react';
import Layout from '@theme/Layout';
import * as Icons from '@fluentui/react-icons-mdl2'

const IconsPage = () => {

    // HACK: Fix broken TextDocumentSettingsIcon size https://github.com/microsoft/fluentui/issues/21645
    const iconComponentRef: React.RefObject<HTMLDivElement> = React.useRef()
    React.useEffect(() => {
        const svgElementRef = iconComponentRef.current?.children[0]?.children[0] as SVGElement
        if (svgElementRef) {
            svgElementRef.style.width = "36px"
            svgElementRef.style.height = "36px"
        }
    }, [iconComponentRef.current])


    const icons = Object.entries(Icons).reduce((acc, [iconName, iconComponent]) => {
        const icon = React.createElement(iconComponent as React.FC<React.HTMLAttributes<HTMLSpanElement>>, { style: { width: 36, height: 36 } })
        if ('displayName' in iconComponent) {
            acc[iconName.slice(0, -4)] = iconName === "TextDocumentSettingsIcon" ? <div ref={iconComponentRef}>{icon}</div> : icon
        }
        return acc
    }, {} as { [key: string]: JSX.Element })

    return (
        <Layout title="Hello">
            <div style={{ padding: 72 }}>
                <div
                    id="iconSet"
                    style={{
                        width: '100%',
                        justifyContent: 'center',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '36px',

                    }}>
                    {Object.entries(icons).map(([iconName, iconElement]) => {
                        return <div key={iconName} style={{
                            flex: 1,
                            textAlign: 'center',
                            flexBasis: '11%'
                        }}>
                            <div>{iconElement}</div>
                        </div>
                    })}
                </div>
            </div>
        </Layout>
    );
}

export default IconsPage;