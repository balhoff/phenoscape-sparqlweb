<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method="html" indent="yes"/>
    
    <xsl:template match="/">
        <table>
            <thead>
                <tr><th>Submitted</th><th>Provisional IRI</th><th>Label</th><th>Description</th><th>Parent</th><th>Permanent IRI</th><th class="deleter"></th></tr>
            </thead>
            <tbody>
                <xsl:apply-templates select="//classBeanResultList"/>
            </tbody>
        </table>
    </xsl:template>
    
    <xsl:template match="classBeanResultList"><xsl:apply-templates select="classBean"/></xsl:template>
    
    <xsl:template match="classBean">
        <tr>
            <xsl:attribute name="data-provisional-iri"><xsl:value-of select="fullId"/></xsl:attribute>
            <td><xsl:for-each select="relations/entry">
                <xsl:if test="string='provisionalCreated'">
                    <xsl:apply-templates select="date"></xsl:apply-templates>
                </xsl:if>
            </xsl:for-each></td>
            <td><xsl:apply-templates select="fullId"/></td>
            <td><xsl:apply-templates select="label"/></td>
            <td><xsl:apply-templates select="definitions"/></td>
            <td>
                <xsl:for-each select="relations/entry">
                    <xsl:if test="string='provisionalSubclassOf'">
                        <xsl:apply-templates select=".//uriString"/> 
                    </xsl:if>
                </xsl:for-each>
            </td>
            <td>
                <xsl:for-each select="relations/entry">
                    <xsl:if test="string='provisionalPermanentId'">
                        <xsl:if test="contains(string[position() = 2], 'http')">
                            <a class="term-link"><xsl:attribute name="href"><xsl:value-of select="string[position() = 2]"/></xsl:attribute><xsl:value-of select="string[position() = 2]"/></a>
                        </xsl:if>
                        <input type="button" value="Update" onclick="insert_permanent_id_editor($(this).parent());"></input>
                    </xsl:if>
                </xsl:for-each>
            </td>
            <td class="deleter">
                <input type="button" value="Delete" onclick="delete_term($(this).parent().parent().data('provisional-iri'));"></input>
            </td>
        </tr>
    </xsl:template>
        
    <xsl:template match="uriString"><a class="term-link"><xsl:attribute name="href"><xsl:value-of select="."/></xsl:attribute><xsl:value-of select="."/></a></xsl:template>
    
    <xsl:template match="date"><xsl:apply-templates/></xsl:template>
    
</xsl:stylesheet>