#! /usr/bin/perl -w
use strict;

use CGI;
use Net::SMTP;
use Data::Dumper qw( Dumper );

my $q = new CGI() or die $!;

#print '<pre>';
#print Dumper( $q );
#print '</pre>';

my @fields = qw( name email siteurl subject comments );

if ( join( '', map { $q->param($_) || '' } @fields ) ) {
    my $subject = $q->param( 'subject' ) || '';
    my $text = <<__EMAIL__;
From: biohack.net
To: will\@biohack.net
Subject: biohack.net inquiry ($subject)

__EMAIL__

    $text .= join( "\n", map {
	"$_: " . ($q->param($_) || '')
	} sort { lc $a cmp lc $b } @fields );
    $text .= "\n\n";

    open( MAIL, '|/usr/sbin/sendmail -t -oi -oeq' ) or die "ERROR: Can't send mail using sendmail";
    print MAIL $text;
    close( MAIL );
    die "ERROR: Exit code $? from sendmail" if $?;
}

print $q->header();
print <<__HTML__;
<html>
<head>
<title></title>
    <META HTTP-EQUIV=Refresh CONTENT="2; URL=http://biohack.net/">
	<link rel="stylesheet" type="text/css" href="styles.css" media="all" />
</style>
</head>
<body>
<p>
Thanks.
</p>

<div>
<a href="http://biohack.net/">
<img src="logo.png" /><br/>
http://biohack.net
</a>
</div>

</body>
</html>
__HTML__


__END__

my $smtp = Net::SMTP->new( 'mail.tenetti.org' ) or die $!;
$smtp->mail($ENV{USER});
$smtp->to('wbnorris@gmail.com');

$smtp->data();
$smtp->datasend("To: wbnorris\@gmail.com\n");
$smtp->datasend("\n");
$smtp->datasend("A simple test message (tenetti.org)\n");
$smtp->dataend();

$smtp->quit;


__END__
system( '/usr/sbin/sendmail' => '-t', '-oi', '-oeq' => 'wbnorris@gmail.com' );

__END__

#/usr/sbin/sendmail -t -oi -oeq


my $smtp = Net::SMTP->new( 'mail.biohack.net' ) or die $!;
$smtp->mail($ENV{USER});
$smtp->to('wbnorris@gmail.com');

$smtp->data();
$smtp->datasend("To: wbnorris\@gmail.com\n");
$smtp->datasend("\n");
$smtp->datasend("A simple test message (2)\n");
$smtp->dataend();

$smtp->quit;
